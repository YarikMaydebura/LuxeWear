import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, ChevronLeft, Plus, Edit2, Trash2, Check, X } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import type { Address } from '@/types'

export function AddressesPage() {
  const { user, addresses, addAddress, updateAddress, removeAddress, setDefaultAddress } = useAuth()
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<Address>>({})
  const [error, setError] = useState('')

  const resetForm = () => {
    setFormData({})
    setIsAddingNew(false)
    setEditingId(null)
    setError('')
  }

  const handleEdit = (address: Address) => {
    setFormData(address)
    setEditingId(address.id)
    setIsAddingNew(false)
  }

  const handleAddNew = () => {
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      country: 'United States',
    })
    setIsAddingNew(true)
    setEditingId(null)
  }

  const handleChange = (field: keyof Address, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setError('')
  }

  const validateForm = () => {
    const required = ['firstName', 'lastName', 'street', 'city', 'state', 'zipCode', 'country']
    for (const field of required) {
      if (!formData[field as keyof Address]) {
        setError(`${field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')} is required`)
        return false
      }
    }
    return true
  }

  const handleSave = () => {
    if (!validateForm() || !user) return

    if (isAddingNew) {
      const newAddress: Address = {
        id: Math.random().toString(36).substring(2),
        userId: user.id,
        firstName: formData.firstName || '',
        lastName: formData.lastName || '',
        street: formData.street || '',
        apartment: formData.apartment,
        city: formData.city || '',
        state: formData.state || '',
        zipCode: formData.zipCode || '',
        country: formData.country || '',
        phone: formData.phone,
        isDefault: addresses.length === 0,
      }
      addAddress(newAddress)
    } else if (editingId) {
      updateAddress(editingId, formData)
    }

    resetForm()
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this address?')) {
      removeAddress(id)
    }
  }

  const handleSetDefault = (id: string) => {
    setDefaultAddress(id)
  }

  const isEditing = isAddingNew || editingId !== null

  return (
    <div className="container mx-auto px-4 py-8 lg:py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Back Link */}
        <Link
          to="/account"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Account
        </Link>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl lg:text-3xl font-light tracking-wide">My Addresses</h1>
            <p className="text-muted-foreground">Manage your shipping addresses</p>
          </div>
          {!isEditing && (
            <Button onClick={handleAddNew} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add New
            </Button>
          )}
        </div>

        {/* Add/Edit Form */}
        <AnimatePresence>
          {isEditing && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8 overflow-hidden"
            >
              <div className="bg-white border border-border rounded-lg p-6">
                <h2 className="text-lg font-medium mb-4">
                  {isAddingNew ? 'Add New Address' : 'Edit Address'}
                </h2>

                {error && (
                  <div className="bg-red-50 text-red-600 px-4 py-3 rounded-md text-sm mb-4">
                    {error}
                  </div>
                )}

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">First Name</label>
                    <input
                      type="text"
                      value={formData.firstName || ''}
                      onChange={(e) => handleChange('firstName', e.target.value)}
                      className="w-full px-4 py-2 border border-stone-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Last Name</label>
                    <input
                      type="text"
                      value={formData.lastName || ''}
                      onChange={(e) => handleChange('lastName', e.target.value)}
                      className="w-full px-4 py-2 border border-stone-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium mb-1">Street Address</label>
                    <input
                      type="text"
                      value={formData.street || ''}
                      onChange={(e) => handleChange('street', e.target.value)}
                      className="w-full px-4 py-2 border border-stone-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium mb-1">
                      Apartment, suite, etc. (optional)
                    </label>
                    <input
                      type="text"
                      value={formData.apartment || ''}
                      onChange={(e) => handleChange('apartment', e.target.value)}
                      className="w-full px-4 py-2 border border-stone-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">City</label>
                    <input
                      type="text"
                      value={formData.city || ''}
                      onChange={(e) => handleChange('city', e.target.value)}
                      className="w-full px-4 py-2 border border-stone-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">State</label>
                    <input
                      type="text"
                      value={formData.state || ''}
                      onChange={(e) => handleChange('state', e.target.value)}
                      className="w-full px-4 py-2 border border-stone-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">ZIP Code</label>
                    <input
                      type="text"
                      value={formData.zipCode || ''}
                      onChange={(e) => handleChange('zipCode', e.target.value)}
                      className="w-full px-4 py-2 border border-stone-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Country</label>
                    <input
                      type="text"
                      value={formData.country || ''}
                      onChange={(e) => handleChange('country', e.target.value)}
                      className="w-full px-4 py-2 border border-stone-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium mb-1">Phone (optional)</label>
                    <input
                      type="tel"
                      value={formData.phone || ''}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      className="w-full px-4 py-2 border border-stone-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <Button onClick={handleSave} className="flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    Save Address
                  </Button>
                  <Button variant="outline" onClick={resetForm} className="flex items-center gap-2">
                    <X className="w-4 h-4" />
                    Cancel
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Addresses List */}
        {addresses.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {addresses.map((address) => (
              <motion.div
                key={address.id}
                layout
                className={`bg-white border rounded-lg p-4 relative ${
                  address.isDefault ? 'border-primary' : 'border-border'
                }`}
              >
                {address.isDefault && (
                  <span className="absolute top-2 right-2 text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full">
                    Default
                  </span>
                )}
                <div className="mb-4">
                  <p className="font-medium">
                    {address.firstName} {address.lastName}
                  </p>
                  <p className="text-sm text-muted-foreground">{address.street}</p>
                  {address.apartment && (
                    <p className="text-sm text-muted-foreground">{address.apartment}</p>
                  )}
                  <p className="text-sm text-muted-foreground">
                    {address.city}, {address.state} {address.zipCode}
                  </p>
                  <p className="text-sm text-muted-foreground">{address.country}</p>
                  {address.phone && (
                    <p className="text-sm text-muted-foreground mt-1">{address.phone}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 pt-4 border-t border-border">
                  <button
                    onClick={() => handleEdit(address)}
                    className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </button>
                  {!address.isDefault && (
                    <>
                      <button
                        onClick={() => handleSetDefault(address.id)}
                        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Check className="w-4 h-4" />
                        Set Default
                      </button>
                      <button
                        onClick={() => handleDelete(address.id)}
                        className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700 transition-colors ml-auto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-stone-50 rounded-lg p-12 text-center">
            <MapPin className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-medium mb-2">No addresses saved</h2>
            <p className="text-muted-foreground mb-6">
              Add an address for faster checkout
            </p>
            <Button onClick={handleAddNew} className="inline-flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Address
            </Button>
          </div>
        )}
      </motion.div>
    </div>
  )
}
