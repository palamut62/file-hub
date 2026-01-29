from PIL import Image, ImageDraw

def create_icon():
    # Create a 512x512 transparent image
    size = (512, 512)
    img = Image.new('RGBA', size, (255, 255, 255, 0))
    draw = ImageDraw.Draw(img)

    # Colors
    cloud_color = (255, 255, 255, 255) # White
    arrow_color = (115, 103, 240, 255) # The Purple/Blue Accent from app (#7367F0)
    
    # Draw Cloud Shape (Circles method) - SCALED UP TO FILL 512x512
    # Main clusters
    # Left hump
    draw.ellipse((40, 180, 240, 380), fill=cloud_color)
    # Top hump (Central and bigger)
    draw.ellipse((140, 80, 380, 320), fill=cloud_color) 
    # Right hump
    draw.ellipse((280, 180, 480, 380), fill=cloud_color)
    # Bottom filler
    draw.ellipse((100, 240, 420, 420), fill=cloud_color)
    
    # Draw Arrow (in the middle, pointing up) - SCALED UP
    # Arrow head
    arrow_points = [
        (256, 160),  # Top tip (Higher up)
        (186, 280),  # Left wing (Wider)
        (326, 280)   # Right wing (Wider)
    ]
    draw.polygon(arrow_points, fill=arrow_color)
    
    # Arrow shaft (Wider and longer)
    draw.rectangle((226, 280, 286, 440), fill=arrow_color)

    # Save
    img.save('assets/icon.png')
    print("Clean icon generated at assets/icon.png")

if __name__ == "__main__":
    create_icon()
