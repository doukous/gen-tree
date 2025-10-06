from neo4j import GraphDatabase
from pathlib import Path


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

    def load_query(self, filename: str) -> str:
        directory = Path(__file__).parent / 'queries'
        path = directory / (filename + '.cypher')
        return path.read_text()

    def run_query(self, query_file: str, **kwargs):
        query = self.load_query(query_file)
        result = self.driver.execute_query(query, **kwargs)
        return result


db = DriverExtension()
