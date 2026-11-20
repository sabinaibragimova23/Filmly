# Filmly acceptance criteria

These must stay true after every change. Each one is checked by a test class
in `backend/api/tests.py`.

| ID | Criterion | Test class |
|---|---|---|
| AC-1 | Anyone, even without logging in, can list movies, filter them by title search and genre, and open a movie's detail page. | `AC1PublicCatalogTests` |
| AC-2 | Registration returns a token, login with the same username and password returns the same token, and a wrong password gets 401 with no token. | `AC2AuthTests` |
| AC-3 | A logged-in user can leave one review per movie with a rating from 1 to 5. A second review for the same movie and a rating outside 1-5 are rejected with 400. The movie's average rating reflects published reviews. Anonymous users cannot post reviews. | `AC3ReviewTests` |
| AC-4 | A user can edit and delete only their own reviews. For someone else's review the API answers 404 and nothing changes. | `AC4ReviewOwnershipTests` |
| AC-5 | A logged-in user can add a movie to favorites once, see it in the list and remove it. Adding the same movie twice gets 400. | `AC5FavoriteTests` |

Command: `cd backend && python manage.py test`
