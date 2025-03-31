class Company < ApplicationRecord
  has_many :invoices
  has_many :checks

  validates :name, uniqueness: true
end
