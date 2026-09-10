"""Prepare the supplied Blender bottle scene and render the website's scrub frames.

Run with Blender, passing --mode build, draft, frames, or preview after --.
The supplied .blend is the input; the edited scene is saved separately under output/.
"""

import argparse
import json
import math
from pathlib import Path
import sys

import bpy
from mathutils import Vector
from bpy_extras.object_utils import world_to_camera_view

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "output/bottle-animation"
SCRATCH = Path("/private/tmp/basenote-bottle-work")
FRAME_COUNT = 121
CALLOUTS = [
    {"id": "cap", "label": "Lid and atomizer", "text": [0.685, 0.17], "end": [0.672, 0.17], "start": 0.50},
    {"id": "oil", "label": "Fragrance oil", "text": [0.71, 0.53], "end": [0.697, 0.53], "start": 0.62},
    {"id": "packaging", "label": "Bottle and packaging", "text": [0.68, 0.79], "end": [0.667, 0.79], "start": 0.70},
    {"id": "branding", "label": "Branding and marketing", "text": [0.218, 0.68], "end": [0.231, 0.68], "start": 0.57},
]


def srgb(hex_value):
    values = [int(hex_value[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    return tuple(v / 12.92 if v <= 0.04045 else ((v + 0.055) / 1.055) ** 2.4 for v in values) + (1.0,)


def emission_material(name, color, strength=1, fade=False):
    material = bpy.data.materials.new(name)
    material.use_nodes = True
    nodes = material.node_tree.nodes
    nodes.clear()
    out = nodes.new("ShaderNodeOutputMaterial")
    emit = nodes.new("ShaderNodeEmission")
    emit.inputs["Color"].default_value = color
    emit.inputs["Strength"].default_value = strength
    if fade:
        transparent = nodes.new("ShaderNodeBsdfTransparent")
        mix = nodes.new("ShaderNodeMixShader")
        mix.name = "Callout visibility"
        material.node_tree.links.new(transparent.outputs[0], mix.inputs[1])
        material.node_tree.links.new(emit.outputs[0], mix.inputs[2])
        material.node_tree.links.new(mix.outputs[0], out.inputs["Surface"])
    else:
        material.node_tree.links.new(emit.outputs[0], out.inputs["Surface"])
    return material


def add_text(name, body, collection, font, material):
    data = bpy.data.curves.new(name, "FONT")
    data.body = body
    data.font = font
    data.align_x = "CENTER"
    data.align_y = "CENTER"
    data.resolution_u = 8
    data.materials.append(material)
    obj = bpy.data.objects.new(name, data)
    collection.objects.link(obj)
    return obj


def camera_point(scene, x, y, distance=0.32):
    # Normalised image coordinates, with y measured from the top.
    bounds = scene.camera.data.view_frame(scene=scene)
    half_width = max(v.x / abs(v.z) for v in bounds) * distance
    half_height = max(v.y / abs(v.z) for v in bounds) * distance
    return ((x * 2 - 1) * half_width, (1 - y * 2) * half_height, -distance)


def projected_bounds(scene, name):
    obj = bpy.data.objects[name].evaluated_get(bpy.context.evaluated_depsgraph_get())
    coords = [world_to_camera_view(scene, scene.camera, obj.matrix_world @ Vector(p)) for p in obj.bound_box]
    return min(p.x for p in coords), 1 - max(p.y for p in coords), max(p.x for p in coords), 1 - min(p.y for p in coords)


def anchor_points(scene):
    cap = projected_bounds(scene, "Cap")
    body = projected_bounds(scene, "Bottle Outside")
    label = projected_bounds(scene, "Label")
    oil = projected_bounds(scene, "Bottle Inside")
    return {
        "cap": [cap[2] + 0.009, (cap[1] + cap[3]) / 2],
        "oil": [(oil[0] + oil[2]) / 2, oil[1] + (oil[3] - oil[1]) * 0.55],
        "packaging": [body[2] + 0.008, body[1] + (body[3] - body[1]) * 0.82],
        "branding": [label[0] - 0.009, (label[1] + label[3]) / 2],
    }


def build_scene():
    scene = bpy.context.scene
    if "Hero Callouts" in bpy.data.collections:
        raise RuntimeError("Open the original supplied scene before rebuilding; the edited copy already has callouts.")
    OUTPUT.mkdir(parents=True, exist_ok=True)
    SCRATCH.mkdir(parents=True, exist_ok=True)
    # Re-sample the original movement over 121 genuinely distinct frames.
    for action in bpy.data.actions:
        for layer in action.layers:
            for strip in layer.strips:
                for bag in strip.channelbags:
                    for curve in bag.fcurves:
                        for key in curve.keyframe_points:
                            for point in (key.co, key.handle_left, key.handle_right):
                                point.x = (point.x - 2) * (FRAME_COUNT - 1) / 58 + 1
                        curve.update()
    scene.frame_start = 1
    scene.frame_end = FRAME_COUNT
    scene.render.fps = 30
    scene.render.resolution_x = 1920
    scene.render.resolution_y = 1080
    scene.render.resolution_percentage = 100
    scene.eevee.taa_render_samples = 64
    scene.render.image_settings.media_type = "IMAGE"
    scene.render.image_settings.file_format = "PNG"
    scene.render.image_settings.color_mode = "RGB"
    scene.render.film_transparent = False

    # Imported mesh polygons refer to material slots that do not exist. Normalise
    # these to their assigned material, including the liquid's Boolean cut faces.
    for obj in scene.objects:
        if obj.type == "MESH" and obj.data.materials:
            for polygon in obj.data.polygons:
                polygon.material_index = 0
    bpy.data.objects["Cube"].data.materials.append(bpy.data.materials["Glow"])

    # The provided file links to two absent textures. Make the label self-contained
    # using real text and the same Source Serif family as the site.
    serif = bpy.data.fonts.load(str(SCRATCH / "SourceSerif4.ttf"))
    body_font = bpy.data.fonts.load(str(SCRATCH / "LexendDeca.ttf"))
    serif.pack()
    body_font.pack()
    label = bpy.data.objects["Label"]
    label.data.materials[0] = emission_material("Hero label bronze", srgb("301d14"), 1.0)
    lettering = emission_material("Hero label lettering", srgb("e2be9c"), 1.0)
    wordmark = add_text("Basenote wordmark", "Basenote", scene.collection, serif, lettering)
    wordmark.parent = label
    wordmark.rotation_euler = (math.pi / 2, 0, math.pi)
    wordmark.location = (0, 13.05, 4.5)
    wordmark.data.size = 5.9
    descriptor = add_text("Basenote descriptor", "SOLUTIONS", scene.collection, body_font, lettering)
    descriptor.parent = label
    descriptor.rotation_euler = wordmark.rotation_euler
    descriptor.location = (0, 13.05, 0)
    descriptor.data.size = 1.25
    descriptor.data.space_character = 1.35
    # Keep the shape of the supplied label, adding a fine warm outline.
    edge_data = bpy.data.curves.new("Label outline", "CURVE")
    edge_data.dimensions = "3D"
    edge_data.bevel_depth = 0.045
    edge_data.bevel_resolution = 2
    edge_data.materials.append(lettering)
    edge = bpy.data.objects.new("Label outline", edge_data)
    scene.collection.objects.link(edge)
    edge.parent = label
    spline = edge_data.splines.new("POLY")
    coords = [(-15.3, 13.04, -15.3), (15.3, 13.04, -15.3), (17.0, 13.04, -13.5), (17.0, 13.04, 19.2), (15.3, 13.04, 21.0), (-15.3, 13.04, 21.0), (-17.0, 13.04, 19.2), (-17.0, 13.04, -13.5)]
    spline.points.add(len(coords) - 1)
    for point, coord in zip(spline.points, coords):
        point.co = (*coord, 1)
    spline.use_cyclic_u = True

    # The scene retains a separately editable background collection. The website
    # renders this layer as CSS so its canvas can extend to every viewport ratio.
    background = bpy.data.collections.new("Hero Background")
    scene.collection.children.link(background)
    bpy.ops.mesh.primitive_plane_add(size=2)
    plane = bpy.context.object
    plane.name = "Orange gradient background"
    for collection in list(plane.users_collection):
        collection.objects.unlink(plane)
    background.objects.link(plane)
    plane.parent = scene.camera
    plane.location = (0, 0, -4)
    far_corner = camera_point(scene, 1, 0, 4)
    plane.scale = (far_corner[0] * 1.02, far_corner[1] * 1.02, 1)
    mat = bpy.data.materials.new("Basenote orange gradients")
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    nodes.clear()
    links = mat.node_tree.links
    uv = nodes.new("ShaderNodeTexCoord")
    base = nodes.new("ShaderNodeRGB")
    base.outputs[0].default_value = srgb("050302")
    previous = base.outputs[0]
    for index, (center, scale, tint) in enumerate([
        ((-0.04, 0.97, 0), (0.74, 0.68, 1), "492013"),
        ((1.10, 0.64, 0), (0.78, 0.85, 1), "32140e"),
        ((0.51, 0.04, 0), (0.40, 0.22, 1), "231108"),
    ]):
        subtract = nodes.new("ShaderNodeVectorMath")
        subtract.operation = "SUBTRACT"
        subtract.inputs[1].default_value = center
        links.new(uv.outputs["UV"], subtract.inputs[0])
        divide = nodes.new("ShaderNodeVectorMath")
        divide.operation = "DIVIDE"
        divide.inputs[1].default_value = scale
        links.new(subtract.outputs[0], divide.inputs[0])
        length = nodes.new("ShaderNodeVectorMath")
        length.operation = "DOT_PRODUCT"
        links.new(divide.outputs[0], length.inputs[0])
        links.new(divide.outputs[0], length.inputs[1])
        exponent = nodes.new("ShaderNodeMath")
        exponent.operation = "MULTIPLY"
        exponent.inputs[1].default_value = -3.3
        links.new(length.outputs[1], exponent.inputs[0])
        gaussian = nodes.new("ShaderNodeMath")
        gaussian.operation = "EXPONENT"
        links.new(exponent.outputs[0], gaussian.inputs[0])
        colored = nodes.new("ShaderNodeMixRGB")
        colored.blend_type = "MULTIPLY"
        colored.inputs[0].default_value = 1
        colored.inputs[1].default_value = srgb(tint)
        links.new(gaussian.outputs[0], colored.inputs[2])
        add = nodes.new("ShaderNodeMixRGB")
        add.blend_type = "ADD"
        add.inputs[0].default_value = 1
        links.new(previous, add.inputs[1])
        links.new(colored.outputs[0], add.inputs[2])
        previous = add.outputs[0]
    emit = nodes.new("ShaderNodeEmission")
    links.new(previous, emit.inputs["Color"])
    out = nodes.new("ShaderNodeOutputMaterial")
    links.new(emit.outputs[0], out.inputs["Surface"])
    plane.data.materials.append(mat)

    callouts = bpy.data.collections.new("Hero Callouts")
    scene.collection.children.link(callouts)
    unit = abs(camera_point(scene, 1, 0.5)[0]) * 2 / 1920
    records = []
    for spec in CALLOUTS:
        material = emission_material("Callout " + spec["id"], srgb("eee1d7"), 1, fade=True)
        visibility = material.node_tree.nodes["Callout visibility"].inputs[0]
        start = 1 + spec["start"] * (FRAME_COUNT - 1)
        for frame, amount in [(1, 0), (start, 0), (start + 16, 1), (FRAME_COUNT, 1)]:
            visibility.default_value = amount
            visibility.keyframe_insert("default_value", frame=frame)
        text = add_text("Callout text — " + spec["label"], spec["label"], callouts, body_font, material)
        text.parent = scene.camera
        text.location = camera_point(scene, *spec["text"])
        text.data.align_x = "RIGHT" if spec["id"] == "branding" else "LEFT"
        text.data.size = unit * 36
        curve = bpy.data.curves.new("Leader — " + spec["label"], "CURVE")
        curve.dimensions = "3D"
        curve.bevel_depth = unit * 0.7
        curve.bevel_resolution = 2
        curve.resolution_u = 1
        curve.materials.append(material)
        line = bpy.data.objects.new(curve.name, curve)
        callouts.objects.link(line)
        line.parent = scene.camera
        poly = curve.splines.new("POLY")
        poly.points.add(2)
        curve.bevel_factor_end = 0
        curve.keyframe_insert("bevel_factor_end", frame=start)
        curve.bevel_factor_end = 1
        curve.keyframe_insert("bevel_factor_end", frame=start + 16)
        bpy.ops.mesh.primitive_uv_sphere_add(segments=12, ring_count=6, radius=unit * 2.4)
        dot = bpy.context.object
        dot.name = "Anchor — " + spec["label"]
        for collection in list(dot.users_collection):
            collection.objects.unlink(dot)
        callouts.objects.link(dot)
        dot.parent = scene.camera
        dot.data.materials.append(material)
        records.append((spec, poly, dot))

    samples = []
    for frame in range(1, FRAME_COUNT + 1):
        scene.frame_set(frame)
        bpy.context.view_layer.update()
        anchors = anchor_points(scene)
        body = projected_bounds(scene, "Bottle Outside")
        label_bounds = projected_bounds(scene, "Label")
        center = ((min(body[0], label_bounds[0]) + max(body[2], label_bounds[2])) / 2)
        samples.append({"anchors": {name: [round(v, 5) for v in point] for name, point in anchors.items()}, "center": round(center, 5)})
        for spec, poly, dot in records:
            anchor = anchors[spec["id"]]
            end = spec["end"]
            elbow = [anchor[0] + (end[0] - anchor[0]) * 0.45, end[1]]
            for point, coord in zip(poly.points, (anchor, elbow, end)):
                point.co = (*camera_point(scene, *coord), 1)
                point.keyframe_insert("co", frame=frame)
            dot.location = camera_point(scene, *anchor)
            dot.keyframe_insert("location", frame=frame)

    (ROOT / "data/private-label-hero-motion.json").write_text(json.dumps({"width": 1920, "height": 1080, "frames": samples}, separators=(",", ":")) + "\n")
    scene["hero_notes"] = "121 frames re-sampled from the supplied animation. Hero Callouts and Hero Background are independent layers. Web assets render the bottle only; matching SVG labels and CSS gradients remain responsive."
    # Remove only unused missing image references; no external textures are needed.
    for image in list(bpy.data.images):
        if image.source == "FILE" and not image.has_data:
            bpy.data.images.remove(image, do_unlink=True)
    scene.frame_set(FRAME_COUNT)
    scene.render.filepath = "//preview/frame-"
    bpy.ops.wm.save_as_mainfile(filepath=str(OUTPUT / "Basenote Bottle Animation.blend"), compress=True)
    return {"scene": str(OUTPUT / "Basenote Bottle Animation.blend"), "frames": FRAME_COUNT}


def render(mode):
    scene = bpy.context.scene
    scene.render.image_settings.media_type = "IMAGE"
    scene.render.image_settings.file_format = "PNG"
    scene.render.image_settings.color_mode = "RGB"
    scene.render.resolution_percentage = 100 if mode == "frames" else 50
    visible = mode != "frames"
    for name in ("Hero Background", "Hero Callouts"):
        bpy.data.collections[name].hide_render = not visible
    directory = SCRATCH / ("frames" if mode == "frames" else "preview")
    directory.mkdir(parents=True, exist_ok=True)
    frames = [1, 65, FRAME_COUNT] if mode == "draft" else range(1, FRAME_COUNT + 1)
    for frame in frames:
        scene.frame_set(frame)
        scene.render.filepath = str(directory / f"{frame - 1:03d}.png")
        bpy.ops.render.render(write_still=True)
        print(f"HERO_RENDER {mode} {frame}/{FRAME_COUNT}", flush=True)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--mode", choices=["build", "draft", "frames", "preview"], default="build")
    args = parser.parse_args(sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else [])
    if args.mode == "build":
        print(json.dumps(build_scene()))
    else:
        render(args.mode)
