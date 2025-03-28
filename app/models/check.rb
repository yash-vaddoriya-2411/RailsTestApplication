class Check < ApplicationRecord
  belongs_to :company
  has_one_attached :image
  has_many :check_invoices
  has_many :invoices, through: :check_invoices
end
