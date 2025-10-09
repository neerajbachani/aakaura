export const successResponse = (message: string, data: any = null, status: number = 200) => {
  return Response.json(
    {
      status,
      data,
      message
    },
    { status }
  );
};

export const errorResponse = (message: string, status: number = 500) => {
  return Response.json(
    {
      status,
      data: null,
      message
    },
    { status }
  );
};