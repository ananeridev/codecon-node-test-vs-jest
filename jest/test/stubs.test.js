import {
    describe,
    it,
    jest,
    expect,
    beforeEach
  } from '@jest/globals'

  class Service {
    static async getCharacters({ page, pageSize }) {
        const response = await fetch('https://rickandmortyapi.com/graphql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: `
              query GetCharacters($page: Int, $pageSize: Int) {
                characters(page: $page, pageSize: $pageSize) {
                  info {
                    count
                  }
                  results {
                    id
                    name
                  }
                }
              }
            `,
            variables: {
              page,
              pageSize,
            },
          }),
        });
        
        const data = await response.json();
        return data.data.characters.results;
      }
    }
    
    function mapResponse(data) {
      return data
        .map(({ id, name }, index) => `[${index}] id: ${id}, name: ${name}`)
        .join('\n');
    }
    
    async function run({ page = 1, pageSize = 10 }) {
      const characters = await Service.getCharacters({ page, pageSize });
      const response = mapResponse(characters);
      return response;
    }
    
    describe('Service', () => {
         beforeEach(() => {
        jest.restoreAllMocks();
    });

        it('should retrieve and format characters', async () => {
          // Mock the fetch function using jest.spyOn and mockResolvedValue
          const mockCharacters = [
            { id: 1, name: 'Rick' },
            { id: 2, name: 'Morty' },
          ];
          jest.spyOn(global, 'fetch').mockResolvedValue({
            json: async () => ({ data: { characters: { results: mockCharacters } } }),
          });
      
          // Expected result
          const expected = [
            '[0] id: 1, name: Rick',
            '[1] id: 2, name: Morty',
          ].join('\n');
      
          // Act
          const result = await run({ page: 1, pageSize: 10 });
      
          // Assert
          expect(result).toEqual(expected);
          expect(global.fetch).toHaveBeenCalledTimes(1);
          expect(global.fetch).toHaveBeenCalledWith(
            'https://rickandmortyapi.com/graphql',
            expect.objectContaining({
              method: 'POST',
              headers: expect.objectContaining({
                'Content-Type': 'application/json',
              }),
              body: expect.any(String),
            })
          );
        });

        // ** intercepting individual calls **
        it('should stub different values for API calls', async () => {
            jest.spyOn(global, 'fetch')
              .mockResolvedValueOnce({
                json: async () => ({ data: { characters: { results: [{ id: 1, name: 'Rick' }] } } }),
              })
              .mockResolvedValueOnce({
                json: async () => ({ data: { characters: { results: [{ id: 2, name: 'Morty' }] } } }),
              })
              .mockResolvedValue({
                json: async () => ({ data: { characters: { results: [{ id: 3, name: 'Jerry' }] } } }),
              });
        
            const result1 = await run({ page: 1, pageSize: 1 });
            const result2 = await run({ page: 1, pageSize: 1 });
            const result3 = await run({ page: 1, pageSize: 1 });
        
            expect(result1).toContain('[0] id: 1, name: Rick');
            expect(result2).toContain('[0] id: 2, name: Morty');
            expect(result3).toContain('[0] id: 3, name: Jerry');
        
            expect(global.fetch).toHaveBeenCalledTimes(3)
          });
        });