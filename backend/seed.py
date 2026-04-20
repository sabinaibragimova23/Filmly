"""
Run: python seed.py  — adds 45 movies across 10 genres
Must be run from backend/ directory after migrations.
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'filmly.settings')
django.setup()

from api.models import Movie

movies = [
    # Action
    {"title": "The Dark Knight", "description": "When the Joker wreaks havoc on Gotham, Batman must confront one of the greatest psychological tests of his ability to fight injustice.", "genre": "Action", "year": 2008, "poster_url": "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg"},
    {"title": "Mad Max: Fury Road", "description": "In a post-apocalyptic wasteland, Max teams up with Furiosa to flee from a cult leader and his army in a high-speed chase across the desert.", "genre": "Action", "year": 2015, "poster_url": "https://m.media-amazon.com/images/M/MV5BZDRkODJhOTgtOTc1OC00NTgzLTk4NjItNDgxZDY4YjlmNDY2XkEyXkFqcGc@._V1_.jpg"},
    {"title": "Gladiator", "description": "A Roman general is betrayed and his family murdered. He becomes a gladiator and seeks revenge against the corrupt emperor Commodus.", "genre": "Action", "year": 2000, "poster_url": "https://image.tmdb.org/t/p/w500/ty8TGRuvJLPUmAR1H1nRIsgwvim.jpg"},
    {"title": "John Wick", "description": "An ex-hitman comes out of retirement to track down the gangsters who killed his dog and stole his car.", "genre": "Action", "year": 2014, "poster_url": "https://image.tmdb.org/t/p/w500/fZPSd91yGE9fCcCe6OoQr6E3Bev.jpg"},
    # Sci-Fi
    {"title": "Inception", "description": "A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.", "genre": "Sci-Fi", "year": 2010, "poster_url": "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg"},
    {"title": "Interstellar", "description": "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.", "genre": "Sci-Fi", "year": 2014, "poster_url": "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg"},
    {"title": "The Matrix", "description": "A computer hacker learns about the true nature of his reality and his role in the war against its controllers.", "genre": "Sci-Fi", "year": 1999, "poster_url": "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg"},
    {"title": "Blade Runner 2049", "description": "A young blade runner discovers a long-buried secret that leads him to track down former blade runner Rick Deckard.", "genre": "Sci-Fi", "year": 2017, "poster_url": "https://image.tmdb.org/t/p/w500/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg"},
    {"title": "Arrival", "description": "A linguist works with the military to communicate with alien lifeforms after twelve mysterious spacecraft appear around the world.", "genre": "Sci-Fi", "year": 2016, "poster_url": "https://image.tmdb.org/t/p/w500/x2FJsf1ElAgr63Y3PNPtJrcmpoe.jpg"},
    {"title": "2001: A Space Odyssey", "description": "After discovering a mysterious artifact buried beneath the Lunar surface, mankind sets off on a quest to find its origins with the help of AI.", "genre": "Sci-Fi", "year": 1968, "poster_url": "https://m.media-amazon.com/images/M/MV5BNjU0NDFkMTQtZWY5OS00MmZhLTg3Y2QtZmJhMzMzMWYyYjc2XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg"},
    # Drama
    {"title": "The Shawshank Redemption", "description": "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.", "genre": "Drama", "year": 1994, "poster_url": "https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg"},
    {"title": "Forrest Gump", "description": "The presidencies of Kennedy and Johnson, the Vietnam War, and other historical events unfold from the perspective of an Alabama man with an extraordinary life.", "genre": "Drama", "year": 1994, "poster_url": "https://image.tmdb.org/t/p/w500/saHP97rTPS5eLmrLQEcANmKrsFl.jpg"},
    {"title": "Fight Club", "description": "An insomniac office worker and a devil-may-care soapmaker form an underground fight club that evolves into something much, much more.", "genre": "Drama", "year": 1999, "poster_url": "https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg"},
    {"title": "Schindler's List", "description": "In German-occupied Poland during World War II, Oskar Schindler gradually becomes concerned for his Jewish workforce after witnessing their persecution.", "genre": "Drama", "year": 1993, "poster_url": "https://image.tmdb.org/t/p/w500/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg"},
    {"title": "12 Angry Men", "description": "A jury holdout attempts to prevent a miscarriage of justice by forcing his colleagues to reconsider the evidence in a murder trial.", "genre": "Drama", "year": 1957, "poster_url": "https://image.tmdb.org/t/p/w500/ppd84D2i9W8jXmsyInGyihiSyqz.jpg"},
    {"title": "The Green Mile", "description": "The lives of guards on Death Row are affected by one of their charges: a gentle giant with a mysterious gift and a horrifying fate.", "genre": "Drama", "year": 1999, "poster_url": "https://m.media-amazon.com/images/M/MV5BMTUxMzQyNjA5MF5BMl5BanBnXkFtZTYwOTU2NTY3._V1_FMjpg_UX1000_.jpg"},
    # Crime
    {"title": "The Godfather", "description": "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant youngest son.", "genre": "Crime", "year": 1972, "poster_url": "https://image.tmdb.org/t/p/w500/rSPw7tgCH9c6NqICZef4kZjFOQ5.jpg"},
    {"title": "Pulp Fiction", "description": "The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption.", "genre": "Crime", "year": 1994, "poster_url": "https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg"},
    {"title": "Goodfellas", "description": "The story of Henry Hill and his life in the mob, covering his rise to money and status and his eventual fall.", "genre": "Crime", "year": 1990, "poster_url": "https://image.tmdb.org/t/p/w500/aKuFiU82s5ISJpGZp7YkIr3kCUd.jpg"},
    {"title": "The Departed", "description": "An undercover cop and a mole in the police attempt to identify each other while infiltrating an Irish gang in South Boston.", "genre": "Crime", "year": 2006, "poster_url": "https://image.tmdb.org/t/p/w500/nT97ifVT2J1yMQmeq20Qblg61T.jpg"},
    {"title": "No Country for Old Men", "description": "Violence and mayhem ensue after a hunter stumbles upon a drug deal gone wrong and finds two million dollars near the Rio Grande.", "genre": "Crime", "year": 2007, "poster_url": "https://m.media-amazon.com/images/M/MV5BMjA5Njk3MjM4OV5BMl5BanBnXkFtZTcwMTc5MTE1MQ@@._V1_.jpg"},
    # Thriller
    {"title": "Parasite", "description": "Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.", "genre": "Thriller", "year": 2019, "poster_url": "https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg"},
    {"title": "The Silence of the Lambs", "description": "A young FBI cadet must receive the help of an incarcerated and manipulative cannibal killer to catch another serial killer.", "genre": "Thriller", "year": 1991, "poster_url": "https://image.tmdb.org/t/p/w500/uS9m8OBk1A8eM9I042bx8XXpqAq.jpg"},
    {"title": "Se7en", "description": "Two detectives, a rookie and a veteran, hunt a serial killer who uses the seven deadly sins as his motives in a dark, gritty city.", "genre": "Thriller", "year": 1995, "poster_url": "https://image.tmdb.org/t/p/w500/6yoghtyTpznpBik8EngEmJskVUO.jpg"},
    {"title": "Gone Girl", "description": "With his wife's disappearance having become the focus of an intense media circus, a man sees the spotlight turned harshly on him.", "genre": "Thriller", "year": 2014, "poster_url": "https://image.tmdb.org/t/p/w500/clnyhPqj1SNgpAdeSS6a6fwE6Bo.jpg"},
    {"title": "Prisoners", "description": "When two young girls go missing, a desperate father takes matters into his own hands as a detective races to find them.", "genre": "Thriller", "year": 2013, "poster_url": "https://m.media-amazon.com/images/M/MV5BMTg0NTIzMjQ1NV5BMl5BanBnXkFtZTcwNDc3MzM5OQ@@._V1_FMjpg_UX1000_.jpg"},
    # Horror
    {"title": "The Shining", "description": "A family heads to an isolated hotel for the winter where a sinister presence influences the father into violence, while his psychic son sees horrific visions.", "genre": "Horror", "year": 1980, "poster_url": "https://image.tmdb.org/t/p/w500/b6ko0IKC8MdYBBPkkA1aBPLe2yz.jpg"},
    {"title": "Hereditary", "description": "A grieving family is haunted by tragic and increasingly disturbing occurrences after the death of their secretive grandmother.", "genre": "Horror", "year": 2018, "poster_url": "https://m.media-amazon.com/images/M/MV5BNTEyZGQwODctYWJjZi00NjFmLTg3YmEtMzlhNjljOGZhMWMyXkEyXkFqcGc@._V1_.jpg"},
    {"title": "Get Out", "description": "A young African American man visits his white girlfriend's parents for the weekend, where his concern about their intentions reaches a terrifying boiling point.", "genre": "Horror", "year": 2017, "poster_url": "https://m.media-amazon.com/images/M/MV5BMjUxMDQwNjcyNl5BMl5BanBnXkFtZTgwNzcwMzc0MTI@._V1_FMjpg_UX1000_.jpg"},
    {"title": "A Quiet Place", "description": "A family struggles to survive in a post-apocalyptic world inhabited by blind monsters with an acute sense of hearing.", "genre": "Horror", "year": 2018, "poster_url": "https://image.tmdb.org/t/p/w500/nAU74GmpUk7t5iklEp3bufwDq4n.jpg"},
    # Comedy
    {"title": "The Grand Budapest Hotel", "description": "The adventures of Gustave H, a legendary concierge at a famous European hotel between the wars, and Zero Moustafa, the lobby boy who becomes his friend.", "genre": "Comedy", "year": 2014, "poster_url": "https://image.tmdb.org/t/p/w500/eWdyYQreja6JGCzqHWXpWHDrrPo.jpg"},
    {"title": "The Wolf of Wall Street", "description": "Based on the true story of Jordan Belfort, from his rise to a wealthy stockbroker living the high life to his fall involving corruption and fraud.", "genre": "Comedy", "year": 2013, "poster_url": "https://m.media-amazon.com/images/M/MV5BMjIxMjgxNTk0MF5BMl5BanBnXkFtZTgwNjIyOTg2MDE@._V1_FMjpg_UX1000_.jpg"},
    {"title": "Superbad", "description": "Two co-dependent high school seniors are forced to deal with separation anxiety after their plan to score alcohol for a party goes hilariously wrong.", "genre": "Comedy", "year": 2007, "poster_url": "https://image.tmdb.org/t/p/w500/ek8e8txUyUwd2BNqj6lFEerJfbq.jpg"},
    # Romance
    {"title": "La La Land", "description": "While navigating their careers in Los Angeles, a pianist and an actress fall in love while attempting to reconcile their dreams with their relationship.", "genre": "Romance", "year": 2016, "poster_url": "https://image.tmdb.org/t/p/w500/uDO8zWDhfWwoFdKS4fzkUJt0Rf0.jpg"},
    {"title": "Eternal Sunshine of the Spotless Mind", "description": "When their relationship turns sour, a couple undergoes a medical procedure to have each other erased from their memories forever.", "genre": "Romance", "year": 2004, "poster_url": "https://image.tmdb.org/t/p/w500/5MwkWH9tYHv3mV9OdYTMR5qreIz.jpg"},
    {"title": "Before Sunrise", "description": "A young American man and a French woman meet on a train in Europe and disembark to spend one magical night together in Vienna.", "genre": "Romance", "year": 1995, "poster_url": "https://m.media-amazon.com/images/M/MV5BZDZhZmI1ZTUtYWI3NC00NTMwLTk3NWMtNDc0OGNjM2I0ZjlmXkEyXkFqcGc@._V1_.jpg"},
    # Animation
    {"title": "Spirited Away", "description": "During her family's move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches, and spirits, where humans are changed into beasts.", "genre": "Animation", "year": 2001, "poster_url": "https://image.tmdb.org/t/p/w500/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg"},
    {"title": "WALL-E", "description": "In the distant future, a small waste-collecting robot inadvertently embarks on a space journey that will ultimately decide the fate of mankind.", "genre": "Animation", "year": 2008, "poster_url": "https://image.tmdb.org/t/p/w500/hbhFnRzzg6ZDmm8YAmxBnQpQIPh.jpg"},
    {"title": "Spider-Man: Into the Spider-Verse", "description": "Teen Miles Morales becomes Spider-Man and must join with five spider-powered individuals from other dimensions to stop a threat to all realities.", "genre": "Animation", "year": 2018, "poster_url": "https://image.tmdb.org/t/p/w500/iiZZdoQBEYBv6id8su7ImL0oCbD.jpg"},
    # Adventure
    {"title": "The Lord of the Rings: The Fellowship of the Ring", "description": "A meek Hobbit and eight companions set out on a journey to destroy the powerful One Ring and save Middle-earth from the Dark Lord Sauron.", "genre": "Adventure", "year": 2001, "poster_url": "https://image.tmdb.org/t/p/w500/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg"},
    {"title": "Raiders of the Lost Ark", "description": "Archaeologist and adventurer Indiana Jones is hired by the U.S. government to find the Ark of the Covenant before the Nazis can obtain its power.", "genre": "Adventure", "year": 1981, "poster_url": "https://image.tmdb.org/t/p/w500/ceG9VzoRAVGwivFU403Wc3AHRys.jpg"},
    {"title": "The Revenant", "description": "A frontiersman on a fur trading expedition in the 1820s fights for survival after being mauled by a bear and left for dead by members of his own hunting team.", "genre": "Adventure", "year": 2015, "poster_url": "https://m.media-amazon.com/images/M/MV5BYTgwNmQzZDctMjNmOS00OTExLTkwM2UtNzJmOTJhODFjOTdlXkEyXkFqcGc@._V1_.jpg"},
    # Biography
    {"title": "Oppenheimer", "description": "The story of J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II, and the moral reckoning that followed.", "genre": "Biography", "year": 2023, "poster_url": "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg"},
    {"title": "The Social Network", "description": "As Harvard student Mark Zuckerberg creates Facebook, he is sued by the twins who claimed he stole their idea and his best friend who helped build it.", "genre": "Biography", "year": 2010, "poster_url": "https://image.tmdb.org/t/p/w500/n0ybibhJtQ5icDqTp8eRytcIHJx.jpg"},
    {"title": "Whiplash", "description": "A promising young drummer enrolls at a cut-throat music conservatory where his dreams of greatness are pushed to the limit by a brutal, demanding instructor.", "genre": "Biography", "year": 2014, "poster_url": "https://image.tmdb.org/t/p/w500/7fn624j5lj3xTme2SgiLCeuedmO.jpg"},
]

created = 0
updated = 0
for m in movies:
    obj, new = Movie.objects.get_or_create(title=m["title"], defaults=m)
    if new:
        created += 1
    else:
        obj.poster_url = m["poster_url"]
        obj.description = m["description"]
        obj.save()
        updated += 1

print(f"Done: {created} created, {updated} updated. Total in DB: {Movie.objects.count()} movies.")