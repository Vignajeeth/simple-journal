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
            "mood": 7,
            "entry_content": "Sample Data",
        }
        response = client.post(url="/entries", json=entry_data)
        assert response.status_code == 200
        assert response.json() == {
            "entry_date": "2000-02-02",
            "mood": 7,
            "entry_content": "Sample Data",
            "id": 20000202,
        }

    def test_duplicate_entry(self):
        entry_data = {
            "entry_date": "2000-02-02",
            "mood": 2,
            "entry_content": "Duplicate Data",
        }
        response = client.post(url="/entries", json=entry_data)
        assert response.status_code == 409

    def test_read_entries(self):
        entry_data = {
            "entry_date": "2001-02-02",
            "mood": 7,
            "entry_content": "Read all entries",
        }
        client.post(url="/entries", json=entry_data)
        response = client.get("/entries")
        assert response.status_code == 200
        assert response.json() == [
            {
                "entry_date": "2000-02-02",
                "mood": 7,
                "entry_content": "Sample Data",
                "id": 20000202,
            },
            {
                "entry_date": "2001-02-02",
                "mood": 7,
                "entry_content": "Read all entries",
                "id": 20010202,
            },
        ]

    def test_read_entry(self):
        response = client.get("/entries/20010202")
        assert response.status_code == 200
        assert response.json() == {
            "entry_date": "2001-02-02",
            "mood": 7,
            "entry_content": "Read all entries",
            "id": 20010202,
        }

    def test_read_invalid_entry(self):
        response = client.get("/entries/20020202")
        assert response.status_code == 404

    def test_update_entry(self):
        new_entry = {
            "entry_date": "2000-02-02",
            "mood": 7,
            "entry_content": "New updated data for 20000202",
        }
        response = client.put("/entries/20000202", json=new_entry)
        assert response.status_code == 200
        assert response.json() == {
            "entry_date": "2000-02-02",
            "mood": 7,
            "entry_content": "New updated data for 20000202",
            "id": 20000202,
        }

    def test_update_invalid_entry(self):
        new_entry = {
            "entry_date": "2000-02-02",
            "mood": 2,
            "entry_content": "New updated data for 20000202",
        }
        response = client.put("/entries/20030202", json=new_entry)
        assert response.status_code == 404

    def test_update_invalid_date(self):
        new_entry = {
            "entry_date": "2006-02-02",
            "mood": 2,
            "entry_content": "New updated data for 20000202",
        }
        response = client.put("/entries/20000202", json=new_entry)
        assert response.status_code == 409

    def test_delete_entry(self):
        response = client.delete("/entries/20000202")
        assert response.status_code == 200
        response = client.delete("/entries/20010202")
        assert response.status_code == 200
        response = client.get("/entries")
        assert response.status_code == 200
        assert response.json() == []

    def test_delete_invalid_entry(self):
        response = client.delete("/entries/20000202")
        assert response.status_code == 404
