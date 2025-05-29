from django.core.cache import cache
import json

def cache_note(user_id, note_uuid, note):
    """
    Cache a note in Redis.
    """
    cache_key = f"user:{user_id}:note:{note_uuid}"
    cache.set(cache_key, json.dumps(note), timeout=60*60)
    
def get_cached_note(user_id, note_uuid):
    """
    Retrieve a note from Redis cache.
    """
    cache_key = f"user:{user_id}:note:{note_uuid}"
    cached_note = cache.get(cache_key)
    if cached_note:
        return json.loads(cached_note)
    return None