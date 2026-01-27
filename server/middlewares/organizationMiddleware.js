const { getOrganizationBySlug } = require('../models/organizationModel');
const { getMember } = require('../models/organizationMemberModel');

const checkRole = (allowedRoles) => {
  return async (req, res, next) => {
    const { slug } = req.params;
    const { user } = req;

    if (!user || !user.id) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
        error: 'UNAUTHORIZED'
      });
    }

    try {
      const org = await getOrganizationBySlug(slug);
      if (!org) {
        return res.status(404).json({
          success: false,
          message: 'Organization not found.',
          error: 'NOT_FOUND'
        });
      }

      const member = await getMember(org.id, user.id);
      if (!member || !allowedRoles.includes(member.role)) {
        return res.status(403).json({
          success: false,
          message: 'You do not have the required permissions for this action.',
          error: 'FORBIDDEN'
        });
      }
      
      req.organization = org;
      req.member = member;

      next();
    } catch (error) {
      console.error('Error in organization role check middleware:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error.',
        error: 'INTERNAL_SERVER_ERROR'
      });
    }
  };
};

module.exports = checkRole;