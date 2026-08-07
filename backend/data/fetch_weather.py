import requests


from datetime import datetime, timedelta

# Function to fetch weather data from the Open-Meteo API
def fetch_weather(days=40):
    url = 'https://api.open-meteo.com/v1/forecast'
    
    params = {
        'latitude': '7.284440',
        'longitude': '80.637466',
        'past_days': days,
        'forecast_days': 1,
        'hourly': [
            'temperature_2m',
            'relative_humidity_2m', 
            'pressure_msl',
            'windspeed_10m',
            'cloudcover',
            'rain',
        ],
        'timezone': 'auto'
    }

    try:
        response = requests.get(url, params=params)
        response.raise_for_status()

        data = response.json()

        hourly = data.get('hourly')
        if hourly is None:
            raise ValueError("No hourly data found in the response.")
        
        
        
        # Prepare documents for database insertion

        documents = []

        for i in range(len(hourly['time'])):
            document = {
                'time': hourly['time'][i],
                'temperature_2m': hourly['temperature_2m'][i],
                'relative_humidity_2m': hourly['relative_humidity_2m'][i],
                'pressure_msl': hourly['pressure_msl'][i],
                'windspeed_10m': hourly['windspeed_10m'][i],
                'cloudcover': hourly['cloudcover'][i],
                'rain': hourly['rain'][i],
            }
            documents.append(document)

        return documents

    except requests.exceptions.RequestException as e:
        print('❌ API request failed:', e)
        return []

    except ValueError as e:
        print('❌ Data error:', e)
        return []

    except Exception as e:
        print('❌ Unexpected error:', e)
        return []
