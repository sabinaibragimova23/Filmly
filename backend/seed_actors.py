"""
Run: python seed_actors.py
from the backend/ directory with venv activated.
Updates actor photos to working TMDB URLs.
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'filmly.settings')
django.setup()

from api.models import Movie, Actor, MovieActor

ACTORS_DATA = {
    "Leonardo DiCaprio":   "https://media.themoviedb.org/t/p/w600_and_h900_face/wo2hJpn04vbtmh0B9utCFdsQhxM.jpg",
    "Tom Hardy":           "https://media.themoviedb.org/t/p/w600_and_h900_face/d81K0RH8UX7tZj49tZaQhZ9ewH.jpg",
    "Russell Crowe":       "https://media.themoviedb.org/t/p/w600_and_h900_face/uxiXuVH4vNWrKlJMVVPG1sxAJFe.jpg",
    "Keanu Reeves":        "https://media.themoviedb.org/t/p/w600_and_h900_face/8RZLOyYGsoRe9p44q3xin9QkMHv.jpg",
    "Matthew McConaughey": "https://media.themoviedb.org/t/p/w600_and_h900_face/lCySuYjhXix3FzQdS4oceDDrXKI.jpg",
    "Amy Adams":           "https://media.themoviedb.org/t/p/w600_and_h900_face/1h2r2VTpoFb5QefAaBYYQgQzL9z.jpg",
    "Tom Hanks":           "https://media.themoviedb.org/t/p/w600_and_h900_face/oFvZoKI6lvU03n4YoNGAll9rkas.jpg",
    "Brad Pitt":           "https://media.themoviedb.org/t/p/w600_and_h900_face/r9DzKQLNbh5QfXlrFGHoVNKER7X.jpg",
    "Edward Norton":       "https://media.themoviedb.org/t/p/w600_and_h900_face/8nytsqL59SFJTVYVrN72k6qkGgJ.jpg",
    "Liam Neeson":         "https://media.themoviedb.org/t/p/w600_and_h900_face/g0iIEyt9ILiKTG0g8K69US5VtLy.jpg",
    "Henry Fonda":         "https://media.themoviedb.org/t/p/w600_and_h900_face/6wXWsqSXF3wCsGcwVqiszy6RX9X.jpg",
    "Marlon Brando":       "https://media.themoviedb.org/t/p/w600_and_h900_face/eEHCjqKMWSvQU4bmwhLMsg4RtEr.jpg",
    "Al Pacino":           "https://media.themoviedb.org/t/p/w600_and_h900_face/m8HAAjq1T75JypKk0v1FFQn4ysZ.jpg",
    "John Travolta":       "https://media.themoviedb.org/t/p/w600_and_h900_face/ap8eEYfBKTLixmVVpRlq4NslDD5.jpg",
    "Robert De Niro":      "https://media.themoviedb.org/t/p/w600_and_h900_face/cT8htcckIuyI1Lqwt1CvD02ynTh.jpg",
    "Matt Damon":          "https://media.themoviedb.org/t/p/w600_and_h900_face/At3JgvaNeEN4Z4ESKlhhes85Xo3.jpg",
    "Josh Brolin":         "https://media.themoviedb.org/t/p/w600_and_h900_face/sX2etBbIkxRaCsATyw5ZpOVMPTD.jpg",
    "Song Kang-ho":        "https://media.themoviedb.org/t/p/w600_and_h900_face/kBM9UTPYXUA2RNk210DXhztLFns.jpg",
    "Jodie Foster":        "https://media.themoviedb.org/t/p/w600_and_h900_face/5emVgsLFlU6SmeBIFsF2Y7aqwtG.jpg",
    "Morgan Freeman":      "https://media.themoviedb.org/t/p/w600_and_h900_face/jPsLqiYGSofU4s6BjrxnefMfabb.jpg",
    "Rosamund Pike":       "https://media.themoviedb.org/t/p/w600_and_h900_face/8ObNklHDi2hjdz0ayzJFB9jtqzm.jpg",
    "Hugh Jackman":        "https://media.themoviedb.org/t/p/w600_and_h900_face/oX6CpXmnXCHLyqsa4NEed1DZAKx.jpg",
    "Jack Nicholson":      "https://media.themoviedb.org/t/p/w600_and_h900_face/hBHcQIEa6P48HQAlLZkh0eKSSkG.jpg",
    "Toni Collette":       "https://media.themoviedb.org/t/p/w600_and_h900_face/lzXRh16qe4HHeBN6tMyw0DHvaMn.jpg",
    "Daniel Kaluuya":      "https://media.themoviedb.org/t/p/w600_and_h900_face/jj2kZqJobjom36wlhlYhc38nTwN.jpg",
    "Emily Blunt":         "https://media.themoviedb.org/t/p/w600_and_h900_face/5nCSG5TL1bP1geD8aaBfaLnLLCD.jpg",
    "Ralph Fiennes":       "https://media.themoviedb.org/t/p/w600_and_h900_face/pCnVXH1Uo2ODoOit4UXni8OD9VB.jpg",
    "Ryan Gosling":        "https://media.themoviedb.org/t/p/w600_and_h900_face/lyUyVARQKhGxaxy0FbPJCQRpiaW.jpg",
    "Jim Carrey":          "https://media.themoviedb.org/t/p/w600_and_h900_face/y3U9QfPN6sJaGl6l68xjwWj28ig.jpg",
    "Ethan Hawke":         "https://media.themoviedb.org/t/p/w600_and_h900_face/oojD9jSshvUT4t6AUySsBxoekHk.jpg",
    "Elijah Wood":         "https://media.themoviedb.org/t/p/w600_and_h900_face/ayARmqAe9Aab1zg6FjJG0u9MEBo.jpg",
    "Harrison Ford":       "https://media.themoviedb.org/t/p/w600_and_h900_face/pjBMJVPpcZK23Vt1nzr1zEBTWrP.jpg",
    "Cillian Murphy":      "https://media.themoviedb.org/t/p/w600_and_h900_face/2lKs67r7FI4bPu0AXxMUJZxmUXn.jpg",
    "Jesse Eisenberg":     "https://media.themoviedb.org/t/p/w600_and_h900_face/yYhwWRcxDHTn63gSEF1vnDAD7cD.jpg",
    "Miles Teller":        "https://media.themoviedb.org/t/p/w600_and_h900_face/aNXCuzvek1uLhI7TzCFNQ4E1MYJ.jpg",
    "Christian Bale":      "https://media.themoviedb.org/t/p/w600_and_h900_face/7Pxez9J8fuPd2Mn9kex13YALrCQ.jpg",
    "Joaquin Phoenix":     "https://media.themoviedb.org/t/p/w600_and_h900_face/u38k3hQBDwNX0VA22aQceDp9Iyv.jpg",
    "Shameik Moore":       "https://media.themoviedb.org/t/p/w600_and_h900_face/ovUKfVOwJ7CadEHaG3NDsfA5xRq.jpg",
}

MOVIE_CAST = {
    "The Dark Knight":                                   ["Christian Bale", "Morgan Freeman"],
    "Mad Max: Fury Road":                                ["Tom Hardy"],
    "Gladiator":                                         ["Russell Crowe", "Joaquin Phoenix"],
    "John Wick":                                         ["Keanu Reeves"],
    "Inception":                                         ["Leonardo DiCaprio"],
    "Interstellar":                                      ["Matthew McConaughey"],
    "The Matrix":                                        ["Keanu Reeves"],
    "Blade Runner 2049":                                 ["Ryan Gosling"],
    "Arrival":                                           ["Amy Adams"],
    "2001: A Space Odyssey":                             [],
    "The Shawshank Redemption":                          ["Morgan Freeman"],
    "Forrest Gump":                                      ["Tom Hanks"],
    "Fight Club":                                        ["Brad Pitt", "Edward Norton"],
    "Schindler's List":                                  ["Liam Neeson"],
    "12 Angry Men":                                      ["Henry Fonda"],
    "The Green Mile":                                    ["Tom Hanks"],
    "The Godfather":                                     ["Marlon Brando", "Al Pacino"],
    "Pulp Fiction":                                      ["John Travolta", "Brad Pitt"],
    "Goodfellas":                                        ["Robert De Niro"],
    "The Departed":                                      ["Leonardo DiCaprio", "Matt Damon"],
    "No Country for Old Men":                            ["Josh Brolin"],
    "Parasite":                                          ["Song Kang-ho"],
    "The Silence of the Lambs":                          ["Jodie Foster"],
    "Se7en":                                             ["Brad Pitt", "Morgan Freeman"],
    "Gone Girl":                                         ["Rosamund Pike"],
    "Prisoners":                                         ["Hugh Jackman"],
    "The Shining":                                       ["Jack Nicholson"],
    "Hereditary":                                        ["Toni Collette"],
    "Get Out":                                           ["Daniel Kaluuya"],
    "A Quiet Place":                                     ["Emily Blunt"],
    "The Grand Budapest Hotel":                          ["Ralph Fiennes"],
    "The Wolf of Wall Street":                           ["Leonardo DiCaprio"],
    "Superbad":                                          [],
    "La La Land":                                        ["Ryan Gosling"],
    "Eternal Sunshine of the Spotless Mind":             ["Jim Carrey"],
    "Before Sunrise":                                    ["Ethan Hawke"],
    "Spirited Away":                                     [],
    "WALL-E":                                            [],
    "Spider-Man: Into the Spider-Verse":                 ["Shameik Moore"],
    "The Lord of the Rings: The Fellowship of the Ring": ["Elijah Wood"],
    "Raiders of the Lost Ark":                           ["Harrison Ford"],
    "The Revenant":                                      ["Leonardo DiCaprio"],
    "Oppenheimer":                                       ["Cillian Murphy"],
    "The Social Network":                                ["Jesse Eisenberg"],
    "Whiplash":                                          ["Miles Teller"],
}

actor_objs = {}
for name, photo in ACTORS_DATA.items():
    actor, created = Actor.objects.get_or_create(name=name)
    if actor.photo_url != photo:
        actor.photo_url = photo
        actor.save()
        print(f"  📸 Updated photo: {name}")
    actor_objs[name] = actor

print(f"Actors ready: {len(actor_objs)}")

linked = 0
skipped = 0

for title, cast in MOVIE_CAST.items():
    try:
        movie = Movie.objects.get(title=title)
    except Movie.DoesNotExist:
        print(f"  ⚠ Not found: {title}")
        skipped += 1
        continue
    for actor_name in cast:
        actor = actor_objs.get(actor_name)
        if actor:
            _, created = MovieActor.objects.get_or_create(movie=movie, actor=actor)
            if created:
                linked += 1
                print(f"  ✓ {actor_name} → {title}")

print(f"\nDone. {linked} new links, {skipped} movies not found.")
