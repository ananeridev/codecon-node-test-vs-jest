import {
    describe,
    it,
    beforeEach,
    mock
  } from 'node:test'
  import assert from 'node:assert';

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
        beforeEach(() => mock.restoreAll())
      
        it('should retrieve and format characters', async (context) => {
            const mockCharacters = [
              { id: 1, name: 'Rick' },
              { id: 2, name: 'Morty' },
            ];
          
            context.mock.method(global, 'fetch').mock.mockImplementation(async () => ({
                json: async () => ({ data: { characters: { results: mockCharacters } } }),
              }));
          
            const expected = [
              '[0] id: 1, name: Rick',
              '[1] id: 2, name: Morty',
            ].join('\n');
          
            debugger
            const result = await run({ page: 1, pageSize: 10 });
          
            assert.strictEqual(global.fetch.mock.callCount(), 1);
            const calls = global.fetch.mock.calls;
          
            assert.strictEqual(calls[0].arguments[0], 'https://rickandmortyapi.com/graphql');
          
            debugger
            assert.strictEqual(result, expected);

          });
        });