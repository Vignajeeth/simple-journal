from fastapi.testclient import TestClient

from main import app

client = TestClient(app)


def test_read_main():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Hello World!"}


class TestEntryEndpoints:
    def test_create_entry(self):
        entry_data = {
            "entry_date": "2000-02-02",
            "mood": 4,
            "entry_content": "Sample Data",
        }
        response = client.post(url="/entries", json=entry_data)
        assert response.status_code == 200
        assert response.json() == {
            "entry_date": "2000-02-02",
            "mood": 4,
            "entry_content": "Sample Data",
            "id": 20000202,
        }
