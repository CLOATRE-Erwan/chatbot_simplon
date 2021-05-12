from bdd import BDD
from fastapi import FastAPI
from fastapi.encoders import jsonable_encoder
app = FastAPI()

@app.get("/response/{item_id}/{person_type}")
def read_item(item_id: str,person_type: str):
    response=BDD().get_responses(item_id,person_type)
    variable=str(response)
    return jsonable_encoder(variable)