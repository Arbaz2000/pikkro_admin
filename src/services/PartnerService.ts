// PartnerService.ts - Service for handling partner/driver request API calls

export interface PartnerRequest {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  address: string;
  vehicleType: string;
  vehicleNumber: string;
  dlDocument: string;
  poaDocument: string;
  poiDocument: string;
  rcDocument: string;
  bikePhoto: string;
  profilePicture: string;
  approved: boolean;
  disapproved: boolean;
  registered: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  orders: any[];
}

export interface PartnerRequestStatus {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  vehicleType: string;
  vehicleNumber: string;
  status: 'pending' | 'approved' | 'disapproved';
  documents: {
    dlDocument: string;
    poaDocument: string;
    poiDocument: string;
    rcDocument: string;
    bikePhoto: string;
    profilePicture: string;
  };
  registered: boolean;
  createdAt: string;
  updatedAt: string;
}

class PartnerService {
  private baseUrl = 'https://15.207.211.78.nip.io/api';

  private getHeaders(): Headers {
    const headers = new Headers();
    headers.append('accept', 'application/json, text/plain, */*');
    headers.append('accept-language', 'en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7,hi;q=0.6');
    headers.append('origin', 'https://www.pikkro.com');
    headers.append('referer', 'https://www.pikkro.com/');
    headers.append('sec-fetch-dest', 'empty');
    headers.append('sec-fetch-mode', 'cors');
    headers.append('sec-fetch-site', 'cross-site');
    return headers;
  }

  private mapApiPartnerToPartnerStatus(apiPartner: PartnerRequest): PartnerRequestStatus {
    // Determine status based on approved and disapproved flags
    let status: 'pending' | 'approved' | 'disapproved' = 'pending';
    if (apiPartner.approved) {
      status = 'approved';
    } else if (apiPartner.disapproved) {
      status = 'disapproved';
    }

    return {
      id: apiPartner._id,
      name: `${apiPartner.firstname} ${apiPartner.lastname}`,
      email: apiPartner.email,
      phone: apiPartner.phone,
      address: apiPartner.address,
      vehicleType: apiPartner.vehicleType,
      vehicleNumber: apiPartner.vehicleNumber,
      status,
      documents: {
        dlDocument: apiPartner.dlDocument,
        poaDocument: apiPartner.poaDocument,
        poiDocument: apiPartner.poiDocument,
        rcDocument: apiPartner.rcDocument,
        bikePhoto: apiPartner.bikePhoto,
        profilePicture: apiPartner.profilePicture,
      },
      registered: apiPartner.registered,
      createdAt: apiPartner.createdAt,
      updatedAt: apiPartner.updatedAt,
    };
  }

  async getPartnerRequests(): Promise<PartnerRequestStatus[]> {
    try {
      const response = await fetch(`${this.baseUrl}/partners/getpartners`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: PartnerRequest[] = await response.json();
      return data.map(apiPartner => this.mapApiPartnerToPartnerStatus(apiPartner));
    } catch (error) {
      console.error('Error fetching partner requests:', error);
      throw error;
    }
  }

  async getPartnerRequestDetails(partnerId: string): Promise<PartnerRequestStatus> {
    try {
      // Since the API returns all partners, we'll filter by ID
      const partners = await this.getPartnerRequests();
      const partner = partners.find(p => p.id === partnerId);
      
      if (!partner) {
        throw new Error('Partner request not found');
      }

      return partner;
    } catch (error) {
      console.error('Error fetching partner request details:', error);
      throw error;
    }
  }

  async approvePartnerRequest(partnerId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/partners/approve/${partnerId}`, {
        method: 'PUT',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error approving partner request:', error);
      throw error;
    }
  }

  async disapprovePartnerRequest(partnerId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/partners/disapprove/${partnerId}`, {
        method: 'PUT',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error disapproving partner request:', error);
      throw error;
    }
  }

  async deletePartnerRequest(partnerId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/partners/delete/${partnerId}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error deleting partner request:', error);
      throw error;
    }
  }
}

export default new PartnerService(); 