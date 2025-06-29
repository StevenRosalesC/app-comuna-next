import apiCommunity from '@/utils/communityApi';

export const PersonsReport = {
  /**
   * List all persons
   * @returns File type pdf
   */
  async listAllPersons() {
    const response = await apiCommunity.get('/reports/persons', {
      responseType: 'blob'
    });
    return response.data;
  }
};
