type Person = {
  readonly id: number,
  readonly name: string,
  birth_year: number,
  death_year?: number,
  biography: string,
  image: string
}


type ActressNationality =
  | 'American'
  | 'British'
  | 'Australian'
  | 'Israeli-American'
  | 'South African'
  | 'French'
  | 'Indian'
  | 'Israeli'
  | 'Spanish'
  | 'South Korean'
  | 'Chinese'


type Actress = Person & {
  most_famous_movies: [string, string, string],
  awards: string,
  nationality: ActressNationality
}

//type guard
function isActress(obj: unknown): obj is Actress {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj && typeof obj.id === 'number' &&
    'name' in obj && typeof obj.name === 'string' &&
    'birth_year' in obj && typeof obj.birth_year === 'number' &&
    'death_year' in obj && typeof obj.death_year === 'number' &&
    'biography' in obj && typeof obj.biography === 'string' &&
    'image' in obj && typeof obj.image === 'string' &&
    'most_famous_movies' in obj &&
    Array.isArray(obj.most_famous_movies) &&
    obj.most_famous_movies.length === 3 &&
    obj.most_famous_movies.every(ob => typeof ob === 'string') &&
    'awards' in obj && obj.awards === 'string' &&
    'nationality' in obj &&
    obj.nationality === 'string' &&
    [
      'American', 'British', 'Australian', 'Israeli-American', 'South African', 'French', 'Indian', 'Israeli', 'Spanish', 'South Korean', 'Chinese'
    ].includes(obj.nationality)
  )
}


//funzione per ottenere l'attrice
async function getActress(id: number): Promise<Actress | null> {

  try {
    const response = await fetch(`http://localhost:3333/actresses/${id}`);

    const data: unknown = await response.json();
    console.log(data);

    if (!isActress(data)) {
      throw new Error('Formato dati non valido');
    }
    return data;

  } catch (error) {
    if (error instanceof Error) {
      console.error('Errore nel caricamento dei dati', error);
    } else {
      console.error('Errore sconosciuto', error)
    }
    return null;
  }
}

//funzione per ottenere le attrici
async function getAllActresses(): Promise<Actress[]> {
  try {
    const response = await fetch(`http://localhost:3333/actresses`);
    const data: unknown = await response.json();

    if (!(data instanceof Array)) {
      throw new Error('Formato dei dati errato, non è un array.');
    }

    const actresses: Actress[] = data.filter(isActress);
    return actresses;

  } catch (error) {
    if (error instanceof Error) {
      console.error('Errore nel caricamento dei dati', error);
    } else {
      console.error('Errore sconosciuto', error)
    }
    return [];
  }
}

//funzione per ottenere delle attrici attraverso un array di id
async function getActresses(ids: number[]): Promise<(Actress | null)[]> {
  try {

    const promises = ids.map(id => getActress(id));
    return await Promise.all(promises);

  } catch (error) {
    if (error instanceof Error) {
      console.error('Errore nel caricamento dei dati', error);
    } else {
      console.error('Errore sconosciuto', error)
    }
    return [];

  }
}

function createActress(data: Omit<Actress, 'id'>): Actress {
  return {
    ...data,
    id: Math.floor(Math.random() * 100000)
  }
}

function updateActress(actress: Actress, updates: Partial<Actress>): Actress {
  return {
    ...actress,
    ...updates,
    id: actress.id,
    name: actress.name
  }
}