export const familyDataSample = {
    "id" : 1,
    "type" : "family",
    "lastname" : "Doucouré",

    "payload": {
        "parents" : [
            {
                "firstname" : "father",
                "coordinate" : null,
                "role" : "father"
            },

            {
                "firstname" : "mother",
                "coordinate" : null,
                "role" : "mother"
            }
        ],

        "children" : [
            {
                "firstname" : "child 1",
                "coordinate" : null,
                "role" : "child"
            },

            {
                "firstname" : "child 2",
                "coordinate" : null,
                "role" : "child"
            },

            {
                "firstname" : "child 3",
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