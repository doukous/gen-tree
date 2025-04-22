export const familyDataSample = {
    "id" : 1,
    "type" : "family",
    "lastname" : "Doucouré",

    "payload": {
        "parents" : [
            {
                "firstname" : "father",
                "coordinate" : null,
            },

            {
                "firstname" : "mother",
                "coordinate" : null,
            }
        ],

        "children" : [
            {
                "firstname" : "child 1",
                "coordinate" : null,
            },

            {
                "firstname" : "child 2",
                "coordinate" : null,
            },

            {
                "firstname" : "child 3",
                "coordinate" : null,
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
    }
}