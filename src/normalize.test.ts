import normalize from './normalize';

describe('normalize(text: string): string', () => {
  it('should convert port to PORT', () => {
    expect(normalize('port')).toBe('PORT');
  });

  it('should convert PORT to PORT', () => {
    expect(normalize('PORT')).toBe('PORT');
  });

  it('should convert database-url to DATABASE_URL', () => {
    expect(normalize('database-url')).toBe('DATABASE_URL');
  });

  it('should convert database_url to DATABASE_URL', () => {
    expect(normalize('database_url')).toBe('DATABASE_URL');
  });

  it('should convert databaseUrl to DATABASE_URL', () => {
    expect(normalize('databaseUrl')).toBe('DATABASE_URL');
  });

  it('should convert DatabaseUrl to DATABASE_URL', () => {
    expect(normalize('DatabaseUrl')).toBe('DATABASE_URL');
  });

  it('should convert database.url to DATABASE_URL', () => {
    expect(normalize('database.url')).toBe('DATABASE_URL');
  });

  it('should convert DATABASE_URL to DATABASE_URL', () => {
    expect(normalize('DATABASE_URL')).toBe('DATABASE_URL');
  });
});
