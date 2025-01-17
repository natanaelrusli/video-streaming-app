export function errorResponse(res, statusCode, message, error = null) {
  if (error) {
    console.error('Error:', error);
  }

  return res.status(statusCode).json({
    success: false,
    message,
    ...(error && { error: error.message || error.toString() }),
  });
}

export function successResponse(res, statusCode, message, data = null) {
  return res.status(statusCode).json({
    success: true,
    message,
    ...(data && { data }),
  });
}

export function paginationResponse(res, data, meta, message = 'success') {
  return res.status(200).json({
    success: true,
    message,
    ...(data && { data }),
    meta: {
      total: meta.total,
      page: meta.pageNumber,
      pageSize: meta.pageSize,
      totalPage: Math.ceil(meta.total / meta.pageSize)
    }
  })
}
