# frozen_string_literal: true

module Api
  module V1
    class AuthenticationController < ApiController
      skip_before_action :require_tenant!

      # POST /api/v1/auth/login
      def authenticate
        user = User.find_by(email: params[:email].to_s.downcase)

        if user.nil?
          return json_error('Email not registered', :unauthorized)
        end

        return json_error('Wrong password', :unauthorized) unless user.authenticate(params[:password])
        return json_error('Account is not authorized to log in', :unauthorized) unless User::ROLES.include?(user.role)

        organization = resolve_organization_by_host
        return json_error('Tenant not recognized', :unauthorized) unless organization
        unless user.tenant_id == organization.id
          return json_error('Account is not authorized for this tenant', :unauthorized)
        end

        token = JsonWebToken.encode({ user_id: user.id, role: user.role, scheme: organization.scheme })

        json_response({
          token:,
          user: { id: user.id, email: user.email, role: user.role },
          tenant: { id: organization.id, name: organization.name }
        })
      end

      private

      def resolve_organization_by_host
        Organization.find_by_host(request.host)
      end
    end
  end
end
