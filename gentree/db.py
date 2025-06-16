from neo4j import GraphDatabase


class DriverExtension(object):
    def __init__(self, app=None):
        self.driver = app

    def init_app(self, app):
        self.driver = GraphDatabase.driver(
            app.config.get('URI'), 
            auth=app.config.get('AUTH'),
            database=app.config.get('DATABASE')
        )
        self.driver.verify_connectivity()


db = DriverExtension()
