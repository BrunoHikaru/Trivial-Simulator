import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

const GetJson = () => {
  const [jsonData, setJsonData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://intellion.pt/wp-json/data-manager-api/v1/dados-word/');
        const data = await response.json();
        setJsonData(data);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <View>
      <Text>getJson</Text>
      {jsonData && (
        <View>
          <Text>{JSON.stringify(jsonData, null, 2)}</Text>
          
        </View>
      )}
    </View>
  );
};

export default GetJson;
