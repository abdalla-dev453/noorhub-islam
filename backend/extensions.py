import sys
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate

db = SQLAlchemy()
jwt = JWTManager()
migrate = Migrate()

# Alias this module in sys.modules under both names to guarantee a single singleton instance
sys.modules["backend.extensions"] = sys.modules[__name__]
