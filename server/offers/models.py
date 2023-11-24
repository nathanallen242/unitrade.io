from sqlalchemy.orm import relationship
from datetime import datetime
from .. import db  # Ensure this import is correct based on your project structure
import enum

class OfferStatus(enum.Enum):
    PENDING = "pending"
    ACCEPTED = "accepted"
    DECLINED = "declined"

class Offer(db.Model):
    __tablename__ = 'offers'

    post_id = db.Column(db.Integer, db.ForeignKey('posts.post_id', ondelete="CASCADE"), primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id', ondelete="CASCADE"), primary_key=True)
    offer_date = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.Enum(OfferStatus, name='offerstatus', native_enum=False), default=OfferStatus.PENDING)

    # Relationships
    user = relationship('User', backref='offers', cascade="all, delete")
    post = relationship('Post', backref='offers', cascade="all, delete")

    def toDict(self):
        return {
            'post_id': self.post_id,
            'user_id': self.user_id,
            'offer_date': self.offer_date.strftime('%Y-%m-%d %H:%M:%S'),
            'status': self.status.value  # Assuming you want the string representation
        }