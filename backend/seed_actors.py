"""
Run: python seed_actors.py
from the backend/ directory with venv activated.
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'filmly.settings')
django.setup()

from api.models import Movie, Actor, MovieActor

ACTORS_DATA = {
    "Leonardo DiCaprio":  "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Leonardo_Dicaprio_Cannes_2019.jpg/440px-Leonardo_Dicaprio_Cannes_2019.jpg",
    "Tom Hardy":          "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Tom_Hardy_by_Gage_Skidmore.jpg/440px-Tom_Hardy_by_Gage_Skidmore.jpg",
    "Russell Crowe":      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Russell_Crowe_2017.jpg/440px-Russell_Crowe_2017.jpg",
    "Keanu Reeves":       "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Keanu_Reeves_2014.jpg/440px-Keanu_Reeves_2014.jpg",
    "Matthew McConaughey":"https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Matthew_McConaughey_2019.jpg/440px-Matthew_McConaughey_2019.jpg",
    "Amy Adams":          "https://upload.wikimedia.org/wikipedia/commons/thumb/5/fifty/Amy_Adams_2014.jpg/440px-Amy_Adams_2014.jpg",
    "Tom Hanks":          "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Tom_Hanks_TIFF_2019.jpg/440px-Tom_Hanks_TIFF_2019.jpg",
    "Brad Pitt":          "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Brad_Pitt_2019_by_Glenn_Francis.jpg/440px-Brad_Pitt_2019_by_Glenn_Francis.jpg",
    "Edward Norton":      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Edward_Norton_2012.jpg/440px-Edward_Norton_2012.jpg",
    "Liam Neeson":        "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Liam_Neeson_2011.jpg/440px-Liam_Neeson_2011.jpg",
    "Henry Fonda":        "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Henry_Fonda_2.jpg/440px-Henry_Fonda_2.jpg",
    "Marlon Brando":      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Marlon_Brando_1973.jpg/440px-Marlon_Brando_1973.jpg",
    "Al Pacino":          "https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Al_Pacino.jpg/440px-Al_Pacino.jpg",
    "John Travolta":      "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/John_Travolta_2012.jpg/440px-John_Travolta_2012.jpg",
    "Robert De Niro":     "https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Robert_De_Niro_2011.jpg/440px-Robert_De_Niro_2011.jpg",
    "Matt Damon":         "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/MattDamon2012.jpg/440px-MattDamon2012.jpg",
    "Josh Brolin":        "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Josh_Brolin_2019.jpg/440px-Josh_Brolin_2019.jpg",
    "Song Kang-ho":       "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Song_Kang-ho_2019.jpg/440px-Song_Kang-ho_2019.jpg",
    "Jodie Foster":       "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Jodie_Foster_2016.jpg/440px-Jodie_Foster_2016.jpg",
    "Morgan Freeman":     "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Morgan_Freeman_2018.jpg/440px-Morgan_Freeman_2018.jpg",
    "Rosamund Pike":      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Rosamund_Pike_2019.jpg/440px-Rosamund_Pike_2019.jpg",
    "Hugh Jackman":       "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Hugh_Jackman_2013.jpg/440px-Hugh_Jackman_2013.jpg",
    "Jack Nicholson":     "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Jack_Nicholson_2002.jpg/440px-Jack_Nicholson_2002.jpg",
    "Toni Collette":      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Toni_Collette_2019.jpg/440px-Toni_Collette_2019.jpg",
    "Daniel Kaluuya":     "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Daniel_Kaluuya_2019.jpg/440px-Daniel_Kaluuya_2019.jpg",
    "Emily Blunt":        "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Emily_Blunt_2013.jpg/440px-Emily_Blunt_2013.jpg",
    "Ralph Fiennes":      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Ralph_Fiennes_2011.jpg/440px-Ralph_Fiennes_2011.jpg",
    "Ryan Gosling":       "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Ryan_Gosling_2018.jpg/440px-Ryan_Gosling_2018.jpg",
    "Jim Carrey":         "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Jim_Carrey_2008.jpg/440px-Jim_Carrey_2008.jpg",
    "Ethan Hawke":        "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Ethan_Hawke_2018.jpg/440px-Ethan_Hawke_2018.jpg",
    "Elijah Wood":        "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Elijah_Wood_2013.jpg/440px-Elijah_Wood_2013.jpg",
    "Harrison Ford":      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Harrison_Ford_2019.jpg/440px-Harrison_Ford_2019.jpg",
    "Cillian Murphy":     "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Cillian_Murphy_2018.jpg/440px-Cillian_Murphy_2018.jpg",
    "Jesse Eisenberg":    "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Jesse_Eisenberg_2015.jpg/440px-Jesse_Eisenberg_2015.jpg",
    "Miles Teller":       "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Miles_Teller_SDCC_2014.jpg/440px-Miles_Teller_SDCC_2014.jpg",
    "Christian Bale":     "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Christian_Bale_2019.jpg/440px-Christian_Bale_2019.jpg",
    "Joaquin Phoenix":    "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Joaquin_Phoenix_2018.jpg/440px-Joaquin_Phoenix_2018.jpg",
    "Shameik Moore":      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Shameik_Moore_2018.jpg/440px-Shameik_Moore_2018.jpg",
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

# Create actors
actor_objs = {}
for name, photo in ACTORS_DATA.items():
    actor, _ = Actor.objects.get_or_create(name=name, defaults={"photo_url": photo})
    actor_objs[name] = actor

print(f"Actors ready: {len(actor_objs)}")

# Link to movies
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