// Standardized API response utilities

// Success response
const sendSuccessResponse = (res, statusCode, message, data = null) => {
  const response = {
    success: true,
    message,
  };

  if (data) {
    response.data = data;
  }

  return res.status(statusCode).json(response);
};

// Error response
const sendErrorResponse = (res, statusCode, message, errors = null) => {
  const response = {
    success: false,
    message,
  };

  if (errors) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
};

// Paginated response
const sendPaginatedResponse = (res, statusCode, message, data, pagination) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    pagination: {
      currentPage: pagination.page,
      totalPages: pagination.totalPages,
      totalItems: pagination.totalItems,
      itemsPerPage: pagination.limit,
      hasNextPage: pagination.page < pagination.totalPages,
      hasPrevPage: pagination.page > 1,
    },
  });
};

// Calculate pagination
const calculatePagination = (page, limit, totalItems) => {
  const currentPage = parseInt(page) || 1;
  const itemsPerPage = parseInt(limit) || 10;
  const skip = (currentPage - 1) * itemsPerPage;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return {
    page: currentPage,
    limit: itemsPerPage,
    skip,
    totalPages,
    totalItems,
  };
};

module.exports = {
  sendSuccessResponse,
  sendErrorResponse,
  sendPaginatedResponse,
  calculatePagination,
};
