from uuid import UUID
from pydantic import BaseModel, Field, model_serializer


class Member(BaseModel):
    id: UUID 
    firstname: str
    sex: str

    @model_serializer
    def ser_member(self):
        return (self.id, self.firstname)


class FamilyChoice(BaseModel):
    id: UUID = Field(validation_alias='family_id')
    name: str = Field(validation_alias='family_name')
    members: list[Member]

    @model_serializer
    def ser_family(self):
        return {
            self.name : self.members
        }
