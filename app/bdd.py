from pymongo import MongoClient, errors
from random import randint

class BDD:
    @classmethod

    def connect(cls):
        DOMAIN = 'mongodb'
        PORT = 27017
        client = MongoClient(
            host = [ str(DOMAIN) + ":" + str(PORT) ],
            serverSelectionTimeoutMS = 10000, # 3 second timeout
            username = "isen",
            password = "isenBrest",
    )
        return client
    
    @classmethod
    # Se connecter à la base de données
    def open_connexion(cls):
        cls.client = cls.connect()
        cls.collection = cls.client.chat.data

    @classmethod
    # Se déconnecter de la base de données
    def close_connexion(cls):
        cls.client.close()


    @classmethod
    def get_responses(cls,tag,person):
        cls.open_connexion()
        dons = list(cls.collection.find({'tag':tag}, {'_id': 0}))
        cls.close_connexion()
        responses= dons[0][person]
        return responses[randint(0,(len(responses)-1))]

