import { addressRepository } from '../repositories/address.repository'
import { Address } from '../types'
import { ApiError } from '../utils/api-error'
import { CreateAddressInput, UpdateAddressInput } from '../validators/address.validator'

class AddressService {
  async getAddresses(userId: string): Promise<Address[]> {
    return addressRepository.findByUserId(userId)
  }

  async getAddressById(userId: string, addressId: string): Promise<Address> {
    const address = await addressRepository.findById(addressId)
    if (!address || address.userId !== userId) {
      throw ApiError.notFound('Address not found')
    }
    return address
  }

  async createAddress(userId: string, data: CreateAddressInput): Promise<Address> {
    return addressRepository.create({
      userId,
      ...data,
    })
  }

  async updateAddress(userId: string, addressId: string, data: UpdateAddressInput): Promise<Address> {
    const address = await this.getAddressById(userId, addressId)

    const updated = await addressRepository.update(addressId, userId, data)
    if (!updated) {
      throw ApiError.internal('Failed to update address')
    }

    return updated
  }

  async setDefaultAddress(userId: string, addressId: string): Promise<Address> {
    const address = await this.getAddressById(userId, addressId)

    const updated = await addressRepository.setDefault(addressId, userId)
    if (!updated) {
      throw ApiError.internal('Failed to set default address')
    }

    return updated
  }

  async deleteAddress(userId: string, addressId: string): Promise<void> {
    await this.getAddressById(userId, addressId)
    await addressRepository.delete(addressId, userId)
  }
}

export const addressService = new AddressService()
