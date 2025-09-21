# Utility functions (if needed)
def chunk_text(text, chunk_size=500):
    """Split text into chunks of approx `chunk_size` words"""
    words = text.split()
    for i in range(0, len(words), chunk_size):
        yield " ".join(words[i:i+chunk_size])
