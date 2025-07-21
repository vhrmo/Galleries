"""
This script is used to remove the background from an image.
"""
import os
from PIL import Image
from rembg import remove


WHITE = (255, 255, 255, 255)
BLACK = (0, 0, 0, 255)
TRANSPARENT = (0, 0, 0, 0)

REPLACE_WITH = WHITE
MAX_RESULTING_SIZE = (1024, 1024)


def remove_background(image_path):
    # Processing the image
    inp = Image.open(image_path)

    # Removing the background from the given Image
    output = remove(inp, bgcolor=REPLACE_WITH)

    # add 'no_bg' to the image name
    output_image_path = image_path.split(".")
    output_image_path[-2] += "_no_bg"
    output_image_path[-1] = "png"
    output_image_path = ".".join(output_image_path)

    # downsize the image
    output.thumbnail(MAX_RESULTING_SIZE)

    # Saving the image in the given path
    output.save(output_image_path)


def convert_files_in_dir(dir_path):
    for file in os.listdir(dir_path):
        file_parts = file.split('.')
        ext = file_parts[-1]
        if ext.lower() in ['jpg', 'jpeg', 'png']:
            print(f"Processing {file}")
            remove_background(os.path.join(dir_path, file))

SOURCE_DIR = "/Users/vlado/Downloads/foto"
convert_files_in_dir(SOURCE_DIR)
