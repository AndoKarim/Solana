import requests
import time
import json
from deepdiff import DeepDiff


api_endpoint = "https://api.raydium.io/v2/sdk/liquidity/mainnet.json"
cache_filename = "api_cache.json"
diff_filename = "diff.json"
target_pubkey_mint = "A1WHeFJRqSc2sLm6hV44SywURyCJN4DVsQ5caWmDh5ru"

def fetch_data(api_url, cache_filename):
    try:
        response = requests.get(api_url)
        if response.status_code == 200:
            data = response.json()
            return data
        else:
            print(f"Error: {response.status_code}")
    except Exception as e:
        print(f"An error occurred: {e}")


# def load_cached_data(cache_filename):
#     try:
#         with open(cache_filename, "r") as file:
#             return json.load(file)
#     except (FileNotFoundError, json.JSONDecodeError):
#         return {'timestamp': 0, 'data': None}


# def save_to_cache(data, cache_filename):
#     with open(cache_filename, "w") as file:
#         json.dump(data, file)


# def save_diff(diff, diff_filename):
#     with open(diff_filename, "w") as file:
#         json.dump(diff, file)


# cached_data = load_cached_data(cache_filename)

json_data = fetch_data(api_endpoint, cache_filename)
def find_pubkey_mint_index(pubkey_mint, json_data):
    # Assuming the pubkey mint is stored in a list under a key called 'pubkey_mints'
    pubkey_mints = json_data.get('pubkey_mints', [])
    try:
        index = pubkey_mints.index(pubkey_mint)
        return index
    except ValueError:
        print(f"Pubkey mint {pubkey_mint} not found in the JSON data.")
        return None
index = find_pubkey_mint_index(target_pubkey_mint, json_data)
if index is not None:
    print(f"Index of {target_pubkey_mint}: {index}")
else:
    print("Pubkey mint not found or error occurred.")
# if not json_data:
#     print("Failed to fetch data.")
# else:
#     json_data_str = json.dumps(json_data, sort_keys=True)
#     cached_data_str = json.dumps(cached_data['data'], sort_keys=True) if cached_data['data'] else "{}"
#     diff = DeepDiff(json.loads(json_data_str), json.loads(cached_data_str), ignore_order=True)
#     save_diff(diff, diff_filename)
#     if not diff:
#         print("no diff")
#     else:
#         print("diff")
# save_to_cache({'timestamp': int(time.time()), 'data': json_data}, cache_filename)