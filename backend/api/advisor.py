"""AI movie advisor behind a small Adapter.

The view only knows the MovieAdvisor interface (one method: suggest).
GroqMovieAdvisor adapts the Groq SDK to that interface. The groq package is
imported lazily, inside suggest(), so the rest of the API still starts when
groq is not installed, and tests can pass in a fake advisor without network.
"""
import os

SYSTEM_PROMPT = (
    'You are a movie expert. Recommend 2-3 films. '
    'Format: Title (year) — description. No markdown or asterisks.'
)
DEFAULT_MODEL = 'llama-3.1-8b-instant'


class MovieAdvisor:
    """Interface the view depends on."""

    def suggest(self, user_message: str) -> str:
        raise NotImplementedError


class GroqMovieAdvisor(MovieAdvisor):
    """Adapter: translates suggest() into a Groq chat completion call."""

    def __init__(self, api_key: str, model: str = DEFAULT_MODEL):
        self.api_key = api_key
        self.model = model

    def suggest(self, user_message: str) -> str:
        from groq import Groq  # lazy import, see module docstring

        client = Groq(api_key=self.api_key)
        completion = client.chat.completions.create(
            model=self.model,
            messages=[
                {'role': 'system', 'content': SYSTEM_PROMPT},
                {'role': 'user', 'content': user_message},
            ],
        )
        return completion.choices[0].message.content


def get_advisor():
    """Return the configured advisor, or None if no API key is set."""
    api_key = os.environ.get('GROQ_API_KEY', '')
    if not api_key:
        return None
    return GroqMovieAdvisor(api_key=api_key)
