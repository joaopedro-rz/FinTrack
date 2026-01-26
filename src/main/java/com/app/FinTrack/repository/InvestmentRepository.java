package com.app.FinTrack.repository;

import com.app.FinTrack.domain.entity.Investment;
import com.app.FinTrack.domain.enums.InvestmentType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Repository para operações de banco de dados da entidade Investment.
 */
@Repository
public interface InvestmentRepository extends JpaRepository<Investment, UUID> {

    //BUSCA BÁSICA
    List<Investment> findByUserId(UUID userId);

    List<Investment> findByUserIdOrderByPurchaseDateDesc(UUID userId);

    //FILTROS POR TIPO
    List<Investment> findByUserIdAndType(UUID userId, InvestmentType type);

    //FILTROS POR TICKER
    //Busca investimento por ticker (case insensitive).
    List<Investment> findByUserIdAndTickerIgnoreCase(UUID userId, String ticker);

    //Verifica se o usuário já tem um ativo específico.
    Optional<Investment> findByUserIdAndTickerIgnoreCaseAndType(UUID userId, String ticker, InvestmentType type);

    //FILTROS POR CORRETORA
    List<Investment> findByUserIdAndBrokerIgnoreCase(UUID userId, String broker);

    //FILTROS POR DATA DE COMPRA
    List<Investment> findByUserIdAndPurchaseDateBetween(UUID userId, LocalDate startDate, LocalDate endDate);

    //AGREGAÇÕES (para relatórios)
    //Soma do valor total investido (quantidade * preço de compra).
    @Query("SELECT COALESCE(SUM(i.quantity * i.purchasePrice), 0) FROM Investment i WHERE i.user.id = :userId")
    BigDecimal sumTotalInvestedByUserId(@Param("userId") UUID userId);

    //Soma do valor atual (quantidade * preço atual) - só para investimentos com preço atual
    @Query("SELECT COALESCE(SUM(i.quantity * i.currentPrice), 0) FROM Investment i WHERE i.user.id = :userId AND i.currentPrice IS NOT NULL")
    BigDecimal sumCurrentValueByUserId(@Param("userId") UUID userId);

    //Soma do valor investido por tipo
    @Query("SELECT COALESCE(SUM(i.quantity * i.purchasePrice), 0) FROM Investment i WHERE i.user.id = :userId AND i.type = :type")
    BigDecimal sumTotalInvestedByUserIdAndType(@Param("userId") UUID userId, @Param("type") InvestmentType type);

    long countByUserId(UUID userId);

    long countByUserIdAndType(UUID userId, InvestmentType type);

    //BUSCA POR NOME
    List<Investment> findByUserIdAndNameContainingIgnoreCase(UUID userId, String name);
}
