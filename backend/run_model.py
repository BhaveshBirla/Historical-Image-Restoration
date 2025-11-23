import os
import sys
from PIL import Image
from zeroscratches import EraseScratches

# Suppress symlink warnings from HuggingFace Hub
os.environ["HF_HUB_DISABLE_SYMLINKS_WARNING"] = "1"

def main():
    if len(sys.argv) != 3:
        print("Usage: python run_model.py <input_path> <output_path>", file=sys.stderr)
        sys.exit(1)

    input_path = sys.argv[1]
    output_path = sys.argv[2]

    # Check if input file exists
    if not os.path.exists(input_path):
        print(f"Input file not found: {input_path}", file=sys.stderr)
        sys.exit(1)

    try:
        # Ensure the output directory exists
        os.makedirs(os.path.dirname(output_path), exist_ok=True)

        # Load and process image
        image = Image.open(input_path).convert("RGB")
        eraser = EraseScratches()
        result = eraser.erase(image)

        # Save the result
        Image.fromarray(result).save(output_path)

        print(f"Image processed and saved to {output_path}")
    except Exception as e:
        print(f"Error during processing: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
