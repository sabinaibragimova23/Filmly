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
    "Leonardo DiCaprio":   "https://image.tmdb.org/t/p/w185/wo2hJpn04vbtmh0B9utCFdsQhxM.jpg",
    "Tom Hardy":           "https://image.tmdb.org/t/p/w185/d81K0RH8UX7tZj49tZaQhZ9ewH.jpg",
    "Russell Crowe":       "https://image.tmdb.org/t/p/w185/aAwan6FRCSI7D3d1OKLjTXtKcYm.jpg",
    "Keanu Reeves":        "https://image.tmdb.org/t/p/w185/4D0PpNI0kmP58hgrwGC3wCjxhnm.jpg",
    "Matthew McConaughey": "https://image.tmdb.org/t/p/w185/wJiGedOCZhwMx9DezY8uwbNxmAY.jpg",
    "Amy Adams":           "https://image.tmdb.org/t/p/w185/oxNGOHGMDMBtKMmSfBeFAoSRnhl.jpg",
    "Tom Hanks":           "https://image.tmdb.org/t/p/w185/xndWFsBlClOJFRdhSt4NBwiPq2o.jpg",
    "Brad Pitt":           "https://image.tmdb.org/t/p/w185/cckcYc2v0yh1tc9QjRelptcOBko.jpg",
    "Edward Norton":       "https://image.tmdb.org/t/p/w185/8nytsqL59SFJTVYVrN72k6qkGgJ.jpg",
    "Liam Neeson":         "https://image.tmdb.org/t/p/w185/7ES5KDwrAFGUb08SEHA4gNnMBKy.jpg",
    "Henry Fonda":         "https://image.tmdb.org/t/p/w185/g2GZlcoDhMHEDZ1bHXN6tSCPPH6.jpg",
    "Marlon Brando":       "https://image.tmdb.org/t/p/w185/fuTEPMsBtV1zE98ujPONbKiYDc2.jpg",
    "Al Pacino":           "https://image.tmdb.org/t/p/w185/fMDFeVf0pjopTJbyRSLFwNDm8Wr.jpg",
    "John Travolta":       "https://image.tmdb.org/t/p/w185/jFswTMBZdEuIhByPmKbKdnEERpD.jpg",
    "Robert De Niro":      "https://image.tmdb.org/t/p/w185/cT8htcckIuyI1Lqwt1CvD02ynTh.jpg",
    "Matt Damon":          "https://image.tmdb.org/t/p/w185/3H9rnLgxbBNyUmJoHxsrLBpETAN.jpg",
    "Josh Brolin":         "https://image.tmdb.org/t/p/w185/oLGFqAXUCy3bXPofvj2JXzfZnwt.jpg",
    "Song Kang-ho":        "https://image.tmdb.org/t/p/w185/2Tst4UMBWeMiZpHnxRFMkJfGYMF.jpg",
    "Jodie Foster":        "https://image.tmdb.org/t/p/w185/jFRGDNyfrFBXcWrRwBzAHNBPBTB.jpg",
    "Morgan Freeman":      "https://image.tmdb.org/t/p/w185/oIciMBMJFkQqvX3iCFuqzUFqLgP.jpg",
    "Rosamund Pike":       "https://image.tmdb.org/t/p/w185/wMq9kQXTeQCHUZOG4fAe5cAMVQQ.jpg",
    "Hugh Jackman":        "https://image.tmdb.org/t/p/w185/4Xujtewxqt6aU0Y81tsS9gkjizk.jpg",
    "Jack Nicholson":      "https://image.tmdb.org/t/p/w185/jBtbPMSDKAKEfnFfOVmlWf4LHXM.jpg",
    "Toni Collette":       "https://image.tmdb.org/t/p/w185/7MNpDVMKmF8VoJo9ZTzDFSxKsVT.jpg",
    "Daniel Kaluuya":      "https://image.tmdb.org/t/p/w185/qBOKWqAFBve3gEkDzEbWDaQFFSJ.jpg",
    "Emily Blunt":         "https://image.tmdb.org/t/p/w185/bUqmEpbMkHOpZYfr1q0nmr9TzUJ.jpg",
    "Ralph Fiennes":       "https://image.tmdb.org/t/p/w185/wHCGFJEHiNSf07l3l4Dc8gFPBiG.jpg",
    "Ryan Gosling":        "https://image.tmdb.org/t/p/w185/lyUyVARQKhGxaxy0FSln9aFzqRa.jpg",
    "Jim Carrey":          "https://image.tmdb.org/t/p/w185/u0aSmHGQgbNFSEFCNiHBXBvFOAl.jpg",
    "Ethan Hawke":         "https://image.tmdb.org/t/p/w185/tQGMEDTFGdxJl4Uk2NSbdsBCGxb.jpg",
    "Elijah Wood":         "https://image.tmdb.org/t/p/w185/9IfbNkdRHWjqArQd7K7B7BFdEdi.jpg",
    "Harrison Ford":       "https://image.tmdb.org/t/p/w185/7CcoHCgPEszPUbxKSXRQe3ftRCe.jpg",
    "Cillian Murphy":      "https://image.tmdb.org/t/p/w185/dm6ZMCDDUHiCiPbMuEMXTiEBvNt.jpg",
    "Jesse Eisenberg":     "https://image.tmdb.org/t/p/w185/6MFZMoijZBM5lPzdCEg0vxWnnAz.jpg",
    "Miles Teller":        "https://image.tmdb.org/t/p/w185/cfJCRqgWkzfyoZKkOHzQs5yyGRJ.jpg",
    "Christian Bale":      "https://image.tmdb.org/t/p/w185/qCpZn2e3dimwbryLnqxZuI88PTi.jpg",
    "Joaquin Phoenix":     "https://image.tmdb.org/t/p/w185/nXMzvVF6xR3OXOedozfOcoA20xh.jpg",
    "Shameik Moore":       "https://image.tmdb.org/t/p/w185/oLDsqHXzRFiKPHBMSCVKDfXYHFv.jpg",
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
