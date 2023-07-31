import hashlib
import torch
import random

def sha3_256_hash(input_string):
    # Convert the input string to bytes
    bytes_to_hash = input_string.encode('utf-8')

    # Check if GPU acceleration is available
    # Can be comented out when using only cpu, at the end I did not get better results using the GPU acceleration.
    if torch.cuda.is_available():
        device = torch.device('cuda')
    else:
        device = torch.device('cpu')


    tensor_to_hash = torch.tensor(list(bytes_to_hash), dtype=torch.uint8, device=device)
    sha3_256_hash = hashlib.sha256(tensor_to_hash.cpu().numpy()).hexdigest()

    return sha3_256_hash

#I should not have used the zfill method, as it generates zeroes at the begining
def generate_random_numeric_nonce(min_length, max_length):
    nonce_length = random.randint(min_length, max_length)
    return str(random.randint(0, 10**nonce_length - 1)).zfill(nonce_length)

#Main logic
def mine_block(original_string, leading_zeroes):
    highest_zeroes_found = 0
    highest_zeroes_nonce = ""
    result_string, result_hash = "", ""

    while True:
        # Generate a random numeric nonce with a random length between 1 and 20
        nonce = generate_random_numeric_nonce(1, 20)

        # Replace 'X' with the current nonce
        result_string = original_string.replace('X', nonce)

        # Calculate the hash of the modified string
        result_hash = sha3_256_hash(result_string)

        # Count the number of leading zeroes in the hash
        current_zeroes = len(result_hash) - len(result_hash.lstrip('0'))

        # Check if the current hash has more leading zeroes than the highest found so far
        if current_zeroes > highest_zeroes_found:
            highest_zeroes_found = current_zeroes
            highest_zeroes_nonce = nonce
            print(f"Highest Zeroes Found: {highest_zeroes_found}, Nonce: {highest_zeroes_nonce}, Hash: {result_hash}")

        # Check if the hash starts with the required number of zeroes
        if result_hash.startswith("0" * leading_zeroes):
            return result_string, result_hash

# This is the same order the webpage takes blocknum, nonce, data, prevhash
original_string = "1XDavid Espeleta0000000000000000000000000000000000000000000000000000000000000000"
# 14 just for it not to stop
leading_zeroes = 14  # Set the number of leading zeroes required

#prints in console
result_string, result_hash = mine_block(original_string, leading_zeroes)
print("Result String:", result_string)
print("Result Hash:", result_hash)
