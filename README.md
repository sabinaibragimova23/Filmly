🎬 Filmly
A modern movie review web app where users can discover films, leave reviews, and rate movies they've watched and loved.

🌟 Overview
Filmly is a full-stack web application that brings together movie enthusiasts in one place. Users can browse a curated catalog of films across multiple genres, read and write reviews, and rate movies based on their personal experience.

🛠 Tech Stack
Frontend
Framework: Angular (v17)

Backend
Framework: Django & Django REST Framework (DRF)
Database: SQLite

✨ Features
Movie Catalog
- Browse movies across 10+ genres (Action, Sci-Fi, Drama, Crime, Thriller, Horror, Comedy, Romance, Animation, Adventure, Biography)
- View movie posters, descriptions, and release years

Reviews & Ratings
- Leave reviews for movies you've watched
- Rate movies with a star rating system
- Read reviews from other users

Search & Filter
- Search movies by title
- Filter by genre

🤖 AI Features
AI Movie Advisor
- Chat-based movie recommendation assistant powered by Groq (LLaMA 3)
- Describe your mood or preferences and get personalized film suggestions
- Quick-select chips for popular genres (Horror, Comedy, Drama, Action, Romance, Sci-Fi)

My Actors — Personal Actor Rating
- Personalized actor compatibility scores based on your reviews and favorites
- The more movies you rate, the more accurate your actor match percentage becomes
- Top 3 actors displayed on a podium with gold/silver/bronze rankings
- Each actor shows their top genre, films you've seen them in, and a match percentage

⚙️ Setup and Run
Backend (Python 3.11+)
    cd backend
    python -m venv venv
    venv\Scripts\activate        (macOS/Linux: source venv/bin/activate)
    pip install -r requirements.txt
    pip install groq              (only needed for the AI Movie Advisor)
    copy .env.example .env        (macOS/Linux: cp .env.example .env), then put your own values in .env
    python manage.py migrate
    python seed.py
    python seed_actors.py
    python manage.py runserver    -> http://localhost:8000

Frontend (Node 18+)
    cd frontend
    npm ci
    npm start                     -> http://localhost:4200

The database is no longer stored in the repository. Run migrate and the two seed scripts to get demo data.
Editing or deleting movies through the API needs an admin account: python manage.py createsuperuser

✅ Tests and checks
    cd backend
    python manage.py test         (24 tests: acceptance criteria AC-1..AC-5 and security fixes)
    python manage.py check
    cd ../frontend
    npx tsc -p tsconfig.app.json --noEmit
    npx ng build --configuration development

Acceptance criteria: docs/ACCEPTANCE_CRITERIA.md. Rules for coding agents: AGENTS.md.
Never commit backend/.env, API keys or db.sqlite3.

👥 Group Members
Ibragimova Sabina [24B031809]
Rauan Aldaniyazov [24B031617]
Sabit Amina [24B032027]

🎯 Purpose
The goal of Filmly is to create a simple, clean, and modern platform for movie lovers to track what they've watched, share their opinions, and discover new films recommended by the community — enhanced with AI tools that make the experience smarter and more personal.