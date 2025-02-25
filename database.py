from flask_sqlalchemy import SQLAlchemy
import logging
from config import config  # Ensure we import the correct config file

db = SQLAlchemy()

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def init_db(app):
    try:
        # ✅ Debugging: Print the database URL
        database_uri = config.SQLALCHEMY_DATABASE_URI
        if not database_uri:
            raise ValueError("SQLALCHEMY_DATABASE_URI is missing or empty")

        logger.info(f"Connecting to Database: {database_uri}")

        app.config["SQLALCHEMY_DATABASE_URI"] = database_uri
        app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
        db.init_app(app)

        with app.app_context():
            db.create_all()

        logger.info("Database initialized successfully")

    except Exception as e:
        logger.error(f"Error initializing database: {str(e)}")
