export const familyDataSample = {
    "id" : 1,
    "type" : "family",
    "lastname" : "Doucouré",

    "payload": {
        "parents" : [
            {
                "firstname" : "el hadj",
                "coordinate" : null,
                "role" : "father"
            },

            {
                "firstname" : "khady",
                "coordinate" : null,
                "role" : "mother"
            }
        ],

        "children" : [
            {
                "firstname" : "aida",
                "coordinate" : null,
                "role" : "child"
            },

            {
                "firstname" : "mareme",
                "coordinate" : null,
                "role" : "child"
            },

            {
                "firstname" : "mohamed",
                "coordinate" : null,
                "role" : "child"
            }
        ]
    }
}

export const personDataSample = {
    "type" : "person",
    "id" : 1,
    "family_source_id" : 1,

    "payload" : {
        "firstname" : "mohamed",
        "coordinate" : null,
        "role" : "child"
    }
}