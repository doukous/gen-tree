from uuid import UUID
from pydantic import BaseModel, Field, model_validator


class FamilyMember(BaseModel):
    id: UUID
    firstname: str
    sex: str
    linked_family_id: UUID | None


class FamilyTree(BaseModel):
    uid: UUID = Field(alias='family_id')
    name: str = Field(alias='family_name')

    partners: list[FamilyMember]
    children: list[FamilyMember]

    @model_validator(mode='before')
    @classmethod
    def preprocess_input(cls, data):
        data_preprocessed = {
            'family_id' : data['family_id'],
            'family_name' : data['family_name'],
            'partners': [],
            'children': []
        }

        for member in data['members']:
            if member['family_status'] == 'partner':
                data_preprocessed['partners'].append(member)
            else:
                data_preprocessed['children'].append(member)
            
            del member['family_status']
        
        return data_preprocessed
