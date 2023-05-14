#!/bin/bash

# This script will iterate over all .jpg and .png files, slim them using ImageMagick, and save the output as a .jpg file with 'slim_' in the filename.

# Function to process image
process_image() {
  input_file="$1"
  output_file="slim_${input_file%.*}.jpg"
  max_size="100k"
  max_width="400"

  # Resize the image using ImageMagick and save it as a .jpg file
  convert "$input_file" -resize "${max_width}x>" -define jpeg:extent="$max_size" "$output_file"

  echo "Processed $input_file and saved as $output_file"
}

# Iterate over all .jpg and .png files
for image in *.{jpg,jpeg,png}; do
  [ -f "$image" ] || continue

  # Ignore files containing "slim"
  if [[ "$image" != *"slim"* ]]; then
    process_image "$image"
  fi
done
