'use client';

import { useEffect, useState } from 'react';

interface Animal {
  id: string;
  name: string;
  species: string;
  breed: string | null;
  age: number | null;
  description: string;
  status: string;
  imageUrl: string | null;
}

export default function AnimalList() {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAnimals();
  }, []);

  const fetchAnimals = async () => {
    try {
      const response = await fetch('/api/animals');
      if (!response.ok) {
        throw new Error('Erro ao carregar animais');
      }
      const data = await response.json();
      setAnimals(data);
    } catch (error) {
      setError('Erro ao carregar a lista de animais');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja remover este animal?')) {
      return;
    }

    try {
      const response = await fetch(`/api/animals/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erro ao remover animal');
      }

      setAnimals(animals.filter(animal => animal.id !== id));
      alert('Animal removido com sucesso!');
    } catch (error) {
      alert('Erro ao remover animal');
    }
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  if (animals.length === 0) {
    return <div>Nenhum animal cadastrado.</div>;
  }

  return (
    <div className="space-y-4">
      {animals.map((animal) => (
        <div
          key={animal.id}
          className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold text-gray-700">{animal.name}</h3>
              <p className="text-sm text-gray-600">
                {animal.species} {animal.breed && `- ${animal.breed}`}
              </p>
              {animal.age && (
                <p className="text-sm text-gray-600">{animal.age} anos</p>
              )}
              <p className="mt-2 text-gray-500">{animal.description}</p>
              <p className="mt-2 text-sm">
                <span className="font-semibold text-gray-700">Status:</span>{' '}
                <span
                  className={`${
                    animal.status === 'DISPONIVEL'
                      ? 'text-green-600'
                      : animal.status === 'ADOTADO'
                      ? 'text-blue-600'
                      : 'text-yellow-600'
                  }`}
                >
                  {animal.status}
                </span>
              </p>
            </div>
            {animal.imageUrl && (
              <img
                src={animal.imageUrl}
                alt={animal.name}
                className="w-24 h-24 object-cover rounded-lg"
              />
            )}
          </div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => handleDelete(animal.id)}
              className="text-red-600 hover:text-red-800 text-sm font-medium"
            >
              Remover
            </button>
          </div>
        </div>
      ))}
    </div>
  );
} 