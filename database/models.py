# coding: utf-8
from sqlalchemy import Boolean, CheckConstraint, Column, Date, ForeignKey, ForeignKeyConstraint, Integer, String, Text, UniqueConstraint, text
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base

########################################################################################################################
# Classes describing database for SqlAlchemy ORM, initially created by schema introspection.
#
# Alter this file per your database maintenance policy
#    See https://apilogicserver.github.io/Docs/Project-Rebuild/#rebuilding
#
# Created:  June 25, 2025 21:40:01
# Database: postgresql://postgres:postgres@127.0.0.1:5432/circles
# Dialect:  postgresql
#
# mypy: ignore-errors
########################################################################################################################
 
from database.system.SAFRSBaseX import SAFRSBaseX, TestBase
from flask_login import UserMixin
import safrs, flask_sqlalchemy, os
from safrs import jsonapi_attr
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import relationship
from sqlalchemy.orm import Mapped
from sqlalchemy.sql.sqltypes import NullType
from typing import List

db = SQLAlchemy() 
Base = declarative_base()  # type: flask_sqlalchemy.model.DefaultMeta
metadata = Base.metadata

#NullType = db.String  # datatype fixup
#TIMESTAMP= db.TIMESTAMP

from sqlalchemy.dialects.postgresql import *

if os.getenv('APILOGICPROJECT_NO_FLASK') is None or os.getenv('APILOGICPROJECT_NO_FLASK') == 'None':
    Base = SAFRSBaseX   # enables rules to be used outside of Flask, e.g., test data loading
else:
    Base = TestBase     # ensure proper types, so rules work for data loading
    print('*** Models.py Using TestBase ***')



class Cardtype(Base):  # type: ignore
    __tablename__ = 'cardtype'
    _s_collection_name = 'Cardtype'  # type: ignore

    card_type = Column(String(20), primary_key=True)
    allow_client_generated_ids = True

    # parent relationships (access parent)

    # child relationships (access children)
    CardList : Mapped[List["Card"]] = relationship(back_populates="cardtype")



class Circle(Base):  # type: ignore
    __tablename__ = 'circle'
    _s_collection_name = 'Circle'  # type: ignore
    __table_args__ = (
        CheckConstraint("circle_type::text = ANY (ARRAY['Inner'::character varying, 'Middle'::character varying, 'Outer'::character varying]::text[])"),
    )

    circle_type = Column(String(10), primary_key=True)
    decription = Column(Text)
    allow_client_generated_ids = True

    # parent relationships (access parent)

    # child relationships (access children)
    CardSelectionList : Mapped[List["CardSelection"]] = relationship(back_populates="circle")



class DailyReponseCount(Base):  # type: ignore
    __tablename__ = 'daily_reponse_count'
    _s_collection_name = 'DailyReponseCount'  # type: ignore

    user_id = Column(Integer, primary_key=True, nullable=False)
    response_date = Column(Date, primary_key=True, nullable=False)
    count_inner = Column(Integer, server_default=text("0"))
    count_middle = Column(Integer, server_default=text("0"))
    count_outer = Column(Integer, server_default=text("0"))
    allow_client_generated_ids = True

    # parent relationships (access parent)

    # child relationships (access children)
    ResponseList : Mapped[List["Response"]] = relationship(back_populates="daily_reponse_count")



class Fellowship(Base):  # type: ignore
    __tablename__ = 'fellowship'
    _s_collection_name = 'Fellowship'  # type: ignore

    name = Column(String(5), primary_key=True)
    full_name = Column(String(100))
    website = Column(String(1000))
    allow_client_generated_ids = True

    # parent relationships (access parent)

    # child relationships (access children)
    CardList : Mapped[List["Card"]] = relationship(back_populates="fellowship")
    TagList : Mapped[List["Tag"]] = relationship(back_populates="fellowship")
    UserList : Mapped[List["Users"]] = relationship(back_populates="fellowship")



class Card(Base):  # type: ignore
    __tablename__ = 'card'
    _s_collection_name = 'Card'  # type: ignore

    id = Column(Integer, server_default=text("nextval('card_id_seq'::regclass)"), primary_key=True)
    fellowship_name = Column(ForeignKey('fellowship.name', ondelete='CASCADE'))
    circle_text = Column(Text, nullable=False)
    card_type = Column(ForeignKey('cardtype.card_type'))
    is_active = Column(Boolean, server_default=text("true"))

    # parent relationships (access parent)
    cardtype : Mapped["Cardtype"] = relationship(back_populates=("CardList"))
    fellowship : Mapped["Fellowship"] = relationship(back_populates=("CardList"))

    # child relationships (access children)
    CardSelectionList : Mapped[List["CardSelection"]] = relationship(back_populates="card")
    CardTagList : Mapped[List["CardTag"]] = relationship(back_populates="card")



class Tag(Base):  # type: ignore
    __tablename__ = 'tags'
    _s_collection_name = 'Tag'  # type: ignore
    __table_args__ = (
        UniqueConstraint('tag_name', 'fellowship_name'),
    )

    id = Column(Integer, server_default=text("nextval('tags_id_seq'::regclass)"), primary_key=True)
    tag_name = Column(String(50), nullable=False)
    fellowship_name = Column(ForeignKey('fellowship.name'), nullable=False)

    # parent relationships (access parent)
    fellowship : Mapped["Fellowship"] = relationship(back_populates=("TagList"))

    # child relationships (access children)
    CardTagList : Mapped[List["CardTag"]] = relationship(back_populates="tag")



class Users(Base):  # type: ignore
    __tablename__ = 'users'
    _s_collection_name = 'Users'  # type: ignore

    id = Column(Integer, server_default=text("nextval('users_id_seq'::regclass)"), primary_key=True)
    name = Column(String(100), nullable=False)
    password_hash = Column(String(250))
    password_salt = Column(String(250))
    fellowship_name = Column(ForeignKey('fellowship.name'))
    email = Column(String(255), unique=True)
    cell = Column(String(25))

    # parent relationships (access parent)
    fellowship : Mapped["Fellowship"] = relationship(back_populates=("UserList"))

    # child relationships (access children)
    CardSelectionList : Mapped[List["CardSelection"]] = relationship(back_populates="users")
    ResponseList : Mapped[List["Response"]] = relationship(back_populates="users")



class CardSelection(Base):  # type: ignore
    __tablename__ = 'card_selection'
    _s_collection_name = 'CardSelection'  # type: ignore
    __table_args__ = (
        UniqueConstraint('user_id', 'card_id', 'circle_type'),
    )

    id = Column(Integer, server_default=text("nextval('card_selection_id_seq'::regclass)"), primary_key=True)
    user_id = Column(ForeignKey('users.id'))
    card_id = Column(ForeignKey('card.id'))
    circle_type = Column(ForeignKey('circle.circle_type'))
    selected_date = Column(Date, server_default=text("CURRENT_TIMESTAMP"), nullable=False)

    # parent relationships (access parent)
    card : Mapped["Card"] = relationship(back_populates=("CardSelectionList"))
    circle : Mapped["Circle"] = relationship(back_populates=("CardSelectionList"))
    users : Mapped["Users"] = relationship(back_populates=("CardSelectionList"))

    # child relationships (access children)
    ResponseList : Mapped[List["Response"]] = relationship(back_populates="card")



class CardTag(Base):  # type: ignore
    __tablename__ = 'card_tag'
    _s_collection_name = 'CardTag'  # type: ignore

    id = Column(Integer, server_default=text("nextval('card_tag_id_seq'::regclass)"), primary_key=True)
    card_id = Column(ForeignKey('card.id'), nullable=False)
    tag_id = Column(ForeignKey('tags.id'), nullable=False)

    # parent relationships (access parent)
    card : Mapped["Card"] = relationship(back_populates=("CardTagList"))
    tag : Mapped["Tag"] = relationship(back_populates=("CardTagList"))

    # child relationships (access children)



class Response(Base):  # type: ignore
    __tablename__ = 'response'
    _s_collection_name = 'Response'  # type: ignore
    __table_args__ = (
        ForeignKeyConstraint(['user_id', 'response_date'], ['daily_reponse_count.user_id', 'daily_reponse_count.response_date']),
        UniqueConstraint('user_id', 'card_id', 'response_date')
    )

    id = Column(Integer, server_default=text("nextval('response_id_seq'::regclass)"), primary_key=True)
    user_id = Column(ForeignKey('users.id'))
    card_id = Column(ForeignKey('card_selection.id'))
    response_date = Column(Date, server_default=text("CURRENT_TIMESTAMP"), nullable=False)
    response_text = Column(Text)
    response_bool = Column(Boolean)
    response_range = Column(Integer)

    # parent relationships (access parent)
    card : Mapped["CardSelection"] = relationship(back_populates=("ResponseList"))
    daily_reponse_count : Mapped["DailyReponseCount"] = relationship(back_populates=("ResponseList"))
    users : Mapped["Users"] = relationship(back_populates=("ResponseList"))

    # child relationships (access children)
