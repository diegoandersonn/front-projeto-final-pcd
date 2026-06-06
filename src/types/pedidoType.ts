import StatusEnum from "../enums/statusEnum";

type PedidoType = {
  id: string;
  cliente: string;
  item: string;
  status: StatusEnum;
};

export default PedidoType;