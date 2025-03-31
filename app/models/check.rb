class Check < ApplicationRecord
  belongs_to :company
  has_one_attached :image
  has_many :check_invoices
  has_many :invoices, through: :check_invoices

  validates :number, presence: true, uniqueness: true

  def small_variant
    image.variant(resize_to_fill: [ 60, 60 ]).processed
  end

  def model_variant
    image.variant(resize_to_limit: [ nil, 600 ]).processed
  end
end
